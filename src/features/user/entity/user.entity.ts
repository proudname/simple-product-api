import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import BaseEntity from '../../../common/base.entity';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import UserSchema from '../interfaces/user-schema';

@Entity()
class User extends BaseEntity implements UserSchema {
  @Column({ unique: true })
  @IsEmail()
  email: string;
  @Column({ select: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  replacePlainPassword = async () => {
    if (!this.password) return;
    this.password = await User.hashPassword(this.password);
  };

  static hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  };
}

export default User;
