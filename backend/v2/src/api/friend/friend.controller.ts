import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseFilters,
  Query,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import {
  CreateFriendDto,
  UpdateFriendDto,
  FriendParamsDto,
  AddSenderDto,
} from './dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UniqueConstraintFilter } from 'src/common/filters/uniquie-constraint.filter';
import {
  CreateSwaggerDecorator,
  FindFriendsSwaggerDecorator,
  UpdateFriendSwaggerDecorator,
  GetFriendByIdSwaggerDecorator,
  AddSenderSwaggerDecorator,
} from './swagger';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FriendApiResponse } from './interfaces/friendApiResponse.interface';
import { Message } from '../message/entities/message.entity';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @CreateSwaggerDecorator()
  @Auth()
  @UseFilters(UniqueConstraintFilter)
  @Post()
  create(@Body() createFriendDto: CreateFriendDto, @GetUser() user: User) {
    return this.friendService.create(createFriendDto, user);
  }

  @AddSenderSwaggerDecorator()
  @UseFilters(UniqueConstraintFilter)
  @Post('addsender')
  @Auth()
  addSenderToFriendsList(
    @Body() addSenderDto: AddSenderDto,
    @GetUser() user: User,
  ) {
    return this.friendService.addSenderToFriendsList(addSenderDto, user);
  }

  @FindFriendsSwaggerDecorator()
  @Auth()
  @Get()
  async findAllFriendsById(
    @GetUser() user: User,
    @Query() friendParamsDto: FriendParamsDto,
  ): Promise<
    FriendApiResponse[] | (FriendApiResponse | { lastMessage: Message })[]
  > {
    const { lastMessage } = friendParamsDto;
    const friends = await this.friendService.findAllFriends(
      user,
      friendParamsDto,
    );

    if (lastMessage) {
      return await this.friendService.addLastMessageToFriends(friends, user.id);
    } else {
      return friends.map((f) => {
        return this.friendService.serializeFriendResponse(f);
      });
    }
  }
  @GetFriendByIdSwaggerDecorator()
  @Auth()
  @Get(':id')
  findFriendById(
    @Param('id', ParseMongoIdPipe) friendId: string,
    @GetUser() user: User,
  ) {
    return this.friendService.getFriendById(friendId, user.id);
  }

  @UpdateFriendSwaggerDecorator()
  @Auth()
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFriendDto: UpdateFriendDto,
  ) {
    return this.friendService.update(id, updateFriendDto, user.id);
  }
}
