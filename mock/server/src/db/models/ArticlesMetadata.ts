import { DataTypes, Model, Sequelize } from 'sequelize';

export class ArticlesMetadata extends Model {
  public id!: string;
  public title!: string;
  public body!: string;
  public tags!: string;
  public url!: string;
  public likes_count!: number;
  public stocks_count!: number;
  public comments_count!: number;
  public created_at!: Date;
  public updated_at!: Date;

  public static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.CHAR(20),
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        body: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        tags: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        likes_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        stocks_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comments_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: 'TIMESTAMP',
          allowNull: false,
        },
        updated_at: {
          type: 'TIMESTAMP',
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'ArticlesMetadata',
        tableName: 'articles_metadata',
        createdAt: false,
        updatedAt: false,
        underscored: true,
      }
    );
  }
}
