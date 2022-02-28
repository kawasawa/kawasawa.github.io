import { Sequelize } from 'sequelize';

import { ArticlesMetadata } from './ArticlesMetadata';
import { ArticlesPickup } from './ArticlesPickup';
import { Version } from './Version';

export * from './ArticlesMetadata';
export * from './ArticlesPickup';
export * from './Version';

export const initializeModels = (instance: Sequelize) => {
  ArticlesMetadata.initialize(instance);
  ArticlesPickup.initialize(instance);
  Version.initialize(instance);
};

export const CURRENT_TIMESTAMP = Sequelize.literal('CURRENT_TIMESTAMP');
