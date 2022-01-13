import User from '../../features/user/entity/user.entity';

class UserCredentialsDto {
  email: User['email'];
  password: User['password'];
}

export default UserCredentialsDto;
