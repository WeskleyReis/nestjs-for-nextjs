import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(
   PickType(CreatePostDto, ['title', 'excerpt', 'content', 'coverImageUrl'])
) {
    @IsOptional()
    @IsBoolean({ message: 'Campo de publicar post precisa ser boolean' })
    published?: boolean
}
