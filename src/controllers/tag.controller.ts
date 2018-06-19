import Tag from '../models/tag';
import { Get, Controller, log, Post, Put, required, Delete } from '../middlewares/router';

@Controller('tags')
export default class TagController {

  @Post()
  @log
  async createTag(ctx: any) {
    const name = ctx.request.body.name;
    if (!name) {
      ctx.throw(400, '标签类型不能为空！');
    }

    let isOldTag = await Tag
      .findOne({ name })
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-findOneTag错误！');
      });

    if (isOldTag !== null) {
      return ctx.success({
        msg: '这是已经存在的标签！',
        data: isOldTag
      });
    }

    let tag = new Tag({
      name
    });

    let result = await tag
      .save()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-createTag错误！');
      });

    ctx.success({
      msg: '添加标签成功！',
      data: result
    });
  }

  @Get()
  @log
  async getAllTags(ctx: any) {
    let result = await Tag.find().catch(error => {
      ctx.throw(500, '服务器内部错误-获取所有标签错误！');
    });

    ctx.success({
      msg: '获取所有标签成功！',
      data: result
    });
  }

  @Put(':id')
  @required({ params: 'id' })
  @log
  async modifyTag(ctx: any) {
    let id = ctx.params.id;
    let name = ctx.request.body.name;

    if (!name) {
      ctx.throw(400, '标签类型不能为空！');
    }

    let result = await Tag
      .findByIdAndUpdate(id, {
        name
      }, {
        new: true
      })
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-modifyTag错误！');
      });

    ctx.success({
      msg: '修改标签成功！',
      data: result
    });
  }

  @Delete(':id')
  @required({ params: 'id' })
  @log
  async deleteTag(ctx: any) {
    const id = ctx.params.id;

    let result = await Tag
      .findByIdAndRemove(id)
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-deleteTag错误！');
      });

    ctx.success({
      msg: '删除标签成功！',
      data: result
    });
  }
}
