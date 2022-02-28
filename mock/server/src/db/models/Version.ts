import { DataTypes, Model, Sequelize } from 'sequelize';

export class Version extends Model {
  public last_update!: string;
  public static initialize(sequelize: Sequelize) {
    return this.init(
      {
        last_update: {
          type: DataTypes.CHAR(20),
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Version',
        tableName: 'version',
        createdAt: false,
        updatedAt: false,
        underscored: true,
      }
    );
  }
}
