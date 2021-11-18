import {AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript"
import {User} from "./User"

interface FeedItemAttributes {
  id: number;
  userId: number;
  caption: string;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FeedItemCreationAttributes {
  caption: string;
  fileName: string;
  userId: number;
}

@Table
export class FeedItem extends Model<FeedItemAttributes, FeedItemCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @BelongsTo(() => User, "userId")
  public user!: User

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @Column
  public caption!: string;

  @Column
  public fileName!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
