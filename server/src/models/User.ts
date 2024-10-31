import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import client from '../config/connection.js';

const { hash, compare } = bcrypt;

interface UserAttributes {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    full_name?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public password!: string;
    public full_name?: string;

    public async validatePassword(formPassword: string): Promise<boolean> {
        const is_valid = await compare(formPassword, this.password);
        return is_valid;
    }

    toJSON() {
        const user = Object.assign({}, this.get());
        delete user.password;

        return user;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
      
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
      
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'unique_email',
                msg: 'That email address is already in use'
            },
            validate: {
                isEmail: {
                    msg: 'You must provide a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: {
                args: [6, Infinity],
                msg: 'Your password must be at least 6 characters in length'
              } // Ensure they type at least 6 characters for the password
            }
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.first_name} ${this.last_name}`;
            },
        }
    },

    {
        sequelize: client,
        tableName: 'users',
        underscored: true,
        hooks: {
            async beforeCreate(userRow: any) {
                userRow.password = await hash(userRow.password, 10);
                return userRow;
            },
            
            async beforeBulkCreate(users: any[]) {
                for (const user of users) {
                    user.password = await hash(user.password, 10)
                }
            }
        }
        
    }
);

export default User;