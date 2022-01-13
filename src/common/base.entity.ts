import { PrimaryGeneratedColumn } from 'typeorm';
import Entity from './interfaces/entity.interface';

class BaseEntity implements Entity {
  @PrimaryGeneratedColumn()
  id: number;
}

export default BaseEntity;
