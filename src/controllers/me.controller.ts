import Me from '../models/me';
import { Get, Controller, log, Post } from '../middlewares/router';

@Controller('me')
export default class MeController {

  @Get()
  @log
  async getMeInfo(ctx: any) {
    let result = await Me
      .findOne({})
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-个人信息查找错误！');
      });

    if (result === null) {
      const meObj = new Me({
        content: 'I am IMike'
      });

      const r = await meObj
        .save()
        .catch(error => {
          ctx.throw(500, '服务器内容错误-个人信息初始化错误！');
        });

      ctx.success({
        msg: '个人信息初始化成功！',
        data: r,
      });
    } else {
      ctx.success({
        msg: '个人信息获取成功！',
        data: result,
      });
    }
  }

  @Post()
  @log
  async modifyMeInfo(ctx: any) {
    const content = ctx.request.body.content;
    if (!content) {
      ctx.throw(400, '内容不能为空！');
    }

    let result = await Me
      .findOneAndUpdate({}, {
        content
      }, {
        new: true
      })
      .exec()
      .catch(error => {
        ctx.throw(500, '更新个人信息错误！');
      });

    ctx.success({
      msg: '个人信息修改成功！',
      data: result,
    });
  }
}
