import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user")
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text", {
    unique: true,
    nullable: false,
  })
  email: string;
  @Column("text", {
    unique: true,
    nullable: false,
  })
  username: string;
  @Column("text", {
    nullable: false,
  })
  password: string;
}

export default User;
