import {
  BaseEntity as TypeOrmBaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Entity from './interfaces/entity.interface';

class BaseEntity extends TypeOrmBaseEntity implements Entity {
  @PrimaryGeneratedColumn()
  id: number;
}

export default BaseEntity;
