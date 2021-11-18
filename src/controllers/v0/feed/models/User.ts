import {AutoIncrement, Column, Model, PrimaryKey, Table} from "sequelize-typescript"

interface UserAttributes {
  id: number;
}

@Table
export class User extends Model<UserAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;
}
