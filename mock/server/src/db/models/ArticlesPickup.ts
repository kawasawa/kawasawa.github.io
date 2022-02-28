import { DataTypes, Model, Sequelize } from 'sequelize';

export class ArticlesPickup extends Model {
  public id!: string;
  public data!: string;
  public static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.CHAR(20),
          primaryKey: true,
          allowNull: false,
        },
        data: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'ArticlesPickup',
        tableName: 'articles_pickup',
        createdAt: false,
        updatedAt: false,
        underscored: true,
      }
    );
  }
}
