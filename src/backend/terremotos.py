import pandas as pd
import lightgbm as lgb
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.preprocessing import LabelEncoder
import warnings
import joblib 


warnings.filterwarnings('ignore')

# Nombres de archivos CSV (en la carpeta 'csv')
FICHERO_DATOS = 'csv/terremotos_data.csv'
FICHERO_ETIQUETAS = 'csv/terremotos_labels.csv'
FICHERO_COMBINADO = 'csv/terremotos_combined.csv'

# Nombres de archivos para guardar el modelo y el preprocesador (en la carpeta 'pkl')
FICHERO_MODELO = 'pkl/terremotos_modelo.pkl'
FICHERO_PREPROCESO = 'pkl/terremotos_preproceso.pkl'

# --- CLASE ProcesoCaracteristicas ---
class ProcesoCaracteristicas:
    """
    Clase para encapsular la lógica de preprocesamiento,
    incluyendo Label Encoders para asegurar que las variables categóricas
    se codifiquen de manera idéntica en el entrenamiento y la predicción.
    """
    def __init__(self):
        self.label_encoders = {}
        # Las geo_cols se mantendrán como 'category' si es posible, pero las 'object_cols' serán 'int'
        self.geo_cols = ['geo_level_1_id', 'geo_level_2_id', 'geo_level_3_id']
        self.object_cols = []
        self.feature_order = None 

    def fit(self, df):
        df = df.copy()
        # Identificamos las columnas categóricas de tipo 'object' (letras ofuscadas)
        self.object_cols = df.select_dtypes(include=['object']).columns.tolist()
        
        # 1. Aprender Label Encoding
        for col in self.object_cols:
            df[col] = df[col].fillna('missing') 
            le = LabelEncoder()
            le.fit(df[col].astype(str))
            self.label_encoders[col] = le
            
        # 2. Guardar el orden de las características después de una transformación de prueba
        processed_df = self.transform(df)
        self.feature_order = processed_df.columns.tolist()
        return self
    
    def transform(self, df):
        df = df.copy()
        
        # 1. Aplicar Label Encoding para 'object_cols' (CORRECCIÓN CLAVE AQUÍ)
        for col in self.object_cols:
            if col in self.label_encoders:
                df[col] = df[col].fillna('missing')
                le = self.label_encoders[col]
                # Manejar valores nuevos
                df[col] = df[col].apply(lambda x: x if x in le.classes_ else 'missing')
                
                # CORRECCIÓN: Quitamos .astype('category'). LabelEncoder devuelve INT.
                # LightGBM será informado de que estas INT son categóricas por nombre.
                df[col] = le.transform(df[col].astype(str))
            
        # 2. Conversión a tipo 'category' para Geo-Niveles (Esto es seguro si ya son enteros)
        for col in self.geo_cols:
            if col in df.columns:
                df[col] = df[col].astype('category')

            # 3. Ingeniería de Características (MEJORADO - Alineado con notebooks)
    
    # ============ VULNERABILIDAD DE MATERIALES ============
    weak_materials = [
        'has_superstructure_mud_mortar_stone',
        'has_superstructure_stone_flag',
        'has_superstructure_adobe_mud',
        'has_superstructure_mud_mortar_brick',
        'has_superstructure_bamboo'
    ]
    df['weak_material_count'] = df[weak_materials].sum(axis=1)
    
    strong_materials = [
        'has_superstructure_rc_engineered',
        'has_superstructure_rc_non_engineered',
        'has_superstructure_cement_mortar_brick',
        'has_superstructure_cement_mortar_stone'
    ]
    df['strong_material_count'] = df[strong_materials].sum(axis=1)
    df['vulnerability_score'] = df['weak_material_count'] - df['strong_material_count']
    
    # ============ CARACTERÍSTICAS ESTRUCTURALES ============
    df['age_x_floors'] = df['age'] * df['count_floors_pre_eq']
    df['height_area_ratio'] = df['height_percentage'] / (df['area_percentage'] + 1)
    df['families_per_floor'] = df['count_families'] / (df['count_floors_pre_eq'] + 1)
    
    # ============ CATEGORÍAS DE EDAD ============
    df['is_old'] = (df['age'] > 25).astype(int)
    df['is_very_old'] = (df['age'] > 50).astype(int)
    
    # ============ TOTAL SUPERSTRUCTURE ============
    superstructure_cols = [col for col in df.columns if 'has_superstructure' in col]
    df['total_superstructure_types'] = df[superstructure_cols].sum(axis=1)
    
    # ============ SECONDARY USE ============
    secondary_cols = [col for col in df.columns if 'has_secondary_use_' in col]
    df['total_secondary_uses'] = df[secondary_cols].sum(axis=1)
    
    # ============ GEOGRAPHIC (MÁS IMPORTANTES) ============
    high_risk_regions = [17, 18, 21, 8, 27, 28]
    df['is_high_risk_region'] = df['geo_level_1_id'].isin(high_risk_regions).astype(int)
    
    low_risk_regions = [26, 24, 5, 20, 13, 1]
    df['is_low_risk_region'] = df['geo_level_1_id'].isin(low_risk_regions).astype(int)


        # 4. Asegurar el orden de las características
        if self.feature_order is not None:
            for col in self.feature_order:
                if col not in df.columns:
                    df[col] = 0
            df = df[self.feature_order]
            
        if 'building_id' in df.columns:
            df = df.drop('building_id', axis=1)

        return df

# --- FUNCIÓN DE ENTRENAMIENTO ---

def entrenar_modelo_dano():
    """ Fusiona los datos, entrena y guarda el modelo y el procesador. """
    print("Iniciando fusión de archivos de datos...")
    try:
        data_df = pd.read_csv(FICHERO_DATOS)
        labels_df = pd.read_csv(FICHERO_ETIQUETAS)
    except FileNotFoundError as e:
        print(f"ERROR: Archivo necesario no encontrado: {e.filename}")
        print("Asegúrate de tener 'terremotos_data.csv' y 'terremotos_labels.csv' en la carpeta 'csv/'.")
        return None, None

    # Fusión de características y etiquetas
    train_data = data_df.merge(labels_df, on='building_id')
    train_data.to_csv(FICHERO_COMBINADO, index=False)
    print(f"Archivos fusionados en '{FICHERO_COMBINADO}'.")
    
    # Preparación de X y y
    y = train_data['damage_grade'] - 1 
    X = train_data.drop('damage_grade', axis=1)

    # Ajustar y Transformar el ProcesoCaracteristicas
    preproceso = ProcesoCaracteristicas().fit(X)
    X_processed = preproceso.transform(X)
    joblib.dump(preproceso, FICHERO_PREPROCESO)
    print(f"Lógica de preprocesamiento guardada en '{FICHERO_PREPROCESO}'.")

    # División para validación
    X_train, X_val, y_train, y_val = train_test_split(
        X_processed, y, test_size=0.2, random_state=42, stratify=y
    )

    # Configuración y Entrenamiento de LightGBM
    # La lista de categóricas incluye las geo_cols (tipo 'category') y las object_cols (tipo 'int' codificado)
    lgbm_categorical_features = preproceso.geo_cols + [col for col in X_train.columns if col in preproceso.object_cols]
    
    params = {
        'objective': 'multiclass', 'num_class': 3, 'metric': 'multi_logloss',
        'n_estimators': 2000, 'learning_rate': 0.03, 'verbose': -1, 'n_jobs': -1, 'seed': 42,
        'feature_fraction': 0.8, 'bagging_fraction': 0.8, 'bagging_freq': 1,
    }
    modelo = lgb.LGBMClassifier(**params)

    print("Iniciando entrenamiento de LightGBM...")
    modelo.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        eval_metric='multi_logloss',
        callbacks=[lgb.early_stopping(stopping_rounds=100, verbose=False)],
        # Pasamos la lista de características categóricas (nombres de columna)
        categorical_feature=lgbm_categorical_features 
    )
    print("Entrenamiento completado.")

    # Evaluación
    y_pred_val = modelo.predict(X_val)
    f1_micro = f1_score(y_val, y_pred_val, average='micro')
    print(f"Métrica F1 Micro Promediada en Validación: {f1_micro:.4f}")

    # Guardar el modelo entrenado
    joblib.dump(modelo, FICHERO_MODELO)
    print(f"Modelo entrenado guardado en '{FICHERO_MODELO}'.")
    
    return modelo, preproceso

# --- FUNCIÓN DE PREDICCIÓN ---

def predecir_dano(modelo, preproceso, datos):
    """
    Recibe un modelo entrenado, el procesador y nuevos datos 
    (un DataFrame) y devuelve el grado de daño predicho (1, 2, o 3).
    """
    if not isinstance(datos, pd.DataFrame):
        raise TypeError("Los datos deben ser un DataFrame de Pandas.")

    # 1. Aplicar la Transformación de Características
    X_processed = preproceso.transform(datos)

    # 2. Predicción
    predicciones_lgbm = modelo.predict(X_processed)
    
    # 3. Convertir a los grados de daño originales (1, 2, 3)
    damage_grade_prediccion = predicciones_lgbm + 1 
    
    return damage_grade_prediccion


# --- FLUJO DE EJECUCIÓN PRINCIPAL (Solo se ejecuta al llamar al script) ---

modelo_dano, preproceso_dano = None, None

try:
    modelo_dano = joblib.load(FICHERO_MODELO)
    preproceso_dano = joblib.load(FICHERO_PREPROCESO)
    print("Modelo y procesador cargados desde archivos existentes.")

except FileNotFoundError:
    print("Modelo o procesador no encontrados. Iniciando entrenamiento...")
    modelo_dano, preproceso_dano = entrenar_modelo_dano()
