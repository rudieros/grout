import { Field, InputType, ObjectType } from 'type-graphql'
import { IsEmail, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator'

@InputType()
export class PasswordRecoveryInput {
  @IsEmail()
  @Field({ nullable: true })
  @ValidateIf((o) => !o.code)
  @IsNotEmpty()
  email?: string

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  code?: string

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  newPassword?: string
}
