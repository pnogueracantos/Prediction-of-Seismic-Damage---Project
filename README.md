# Richter's Predictor: Modeling Earthquake Damage

## Intro:

**Purpose:** Based on aspects of building location and construction, your goal is to predict the level of damage to buildings caused by the 2015 Gorkha earthquake in Nepal.

**Objetivo:** Mejorar la predicción del _benchmark_, que utiliza un algoritmo RandomForest y obtiene una **puntuación de 0.5815**.

## Apsectos a mejorar del benchmark

**1.⁠ ⁠Selección de features:**

•⁠  ⁠El modelo base ignora características de gran valor (usa 6 de 38)

•⁠  ⁠⁠No usa, por ejemplo, localización/distancia al epicentro, edad del edificio, o tipo de superestructura/materiales

**2.⁠ ⁠Uso de ⁠ StandardScaler ⁠ innecesario:** RandomForest y otros modelos de árbol ignoran la escala de los datos; se basan en thresholds, no en distancias.

**3.⁠ ⁠No se tiene en cuenta el desbalance de clases:**  ⁠El gráfico de barras muestra que la clase 2 (daño medio) domina sobre el resto, pero no se tiene en cuenta en la definición del modelo.

•⁠  ⁠⁠`class_weight=‘balanced’` ⁠ ⁠ en RF

•⁠  ⁠⁠SMOTE u otras herramientas de resampleado

•⁠  ⁠⁠Sampleado estratificado, uso de cross-validation

**4.⁠ ⁠Búsqueda de hiperparámetros limitada:**

•⁠  ⁠Incluir `max_depth`⁠, `max_features`⁠, `min_samples_split`⁠, ⁠⁠`class_weight` ⁠⁠

**5. No hay comparación con otros modelos de gradient-boosting** (trabajan mejor con datos tabulares)
   
•⁠  ⁠LightGBM

•⁠  ⁠⁠CatBoost

•⁠  ⁠⁠XGBoost

## Primeros pasos realizados

•⁠  ⁠Empezar con LightGBM o CatBoost (que manejan bien los datos categóricos)

•⁠  ⁠⁠Usar las 38 variables

•⁠  ⁠⁠Crear nuevas variables (geográficas, vulnerabilidad estructural)

•⁠  ⁠⁠Afinar hiperparámetros con Optuna o hyperopt

•⁠  ⁠⁠Crear 2-3 modelos (XGBoost + LightsGBM + CatBoost

•⁠  ⁠⁠Usar una fórmula final ponderada de las predicciones 

	- Ejemplo: final_prediction = 0.4 * lgbm_pred + 0.3 * xgb_pred + 0.3 * catboost_pred

## Estructura:

- **01_EDA.ipynb**: Tratamiento de datos y visualización básica de los datasets y variables.

- **02_feature_engineering**: Creación de atributos/ingeniería de atributos. Nuevas variables explicativas.

- **03_modeling**: Tres modelos básicos, LGBM, XGBoost y CatBoost. Ensemble (ponderado y sin ponderar) y Ensemble LGBM+XGBoost

  - Mockup de submisssion


