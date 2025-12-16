# Richter's Predictor: Earthquake Damage Prediction

Predicción del nivel de daño en edificios causado por el terremoto de Nepal 2015 usando Machine Learning.

## Resultados

| Modelo | CV Score (F1-micro) | Mejora |
|--------|---------------------|--------|
| **XGBoost** | **0.7381** | **+25.3%** |
| LightGBM | 0.7371 | +25.2% |
| CatBoost | 0.7134 | +21.2% |
| Baseline | 0.5815 | - |

Dataset: 260,601 edificios | 38 features

## Estructura del Proyecto


## Metodología

**Feature Engineering:**
- Edad del edificio (`age`)
- Agregaciones geográficas (edad media, pisos por región)
- Indicadores binarios de uso secundario

**Modelos:**
- LightGBM, XGBoost, CatBoost
- StratifiedKFold (5 folds)
- RandomizedSearchCV para hiperparámetros
- Out-of-fold predictions

**Mejor Modelo:** XGBoost con 0.7381 F1-score

## Reproducir


## Features Más Importantes

1. geo_level_2_id (localización específica)
2. age (edad del edificio)
3. count_floors_pre_eq (número de pisos)
4. height_percentage (altura relativa)
5. geo_level_1_id (región)

## Competición

[DrivenData - Richter's Predictor](https://www.drivendata.org/competitions/57/nepal-earthquake/)

## Autor

Pablo Noguera Cantos - ML Engineer  
Samsung Innovation Campus  
[pnogueracantos@gmail.com]


