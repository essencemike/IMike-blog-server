import * as md5 from 'md5';
import User from '../models/user';
import { signToken } from '../lib/auth';
import { Get, required, Controller, log, Post, Put } from '../middlewares/router';

@Controller('user')
export default class UserController {

  @Get(':id')
  @required({ params: 'id' })
  @log
  async getUser(ctx: any): Promise<void> {
    ctx.success({
      data: {
        userId: 'IMike',
        userName: 'IMike',
      },
      msg: '获取 user 信息成功！',
    });
  }

  // 用户登录（创建token）
  @Post('login')
  @log
  async login(ctx: any) {
    const { username, password } = ctx.request.body;
    if (!username) {
      ctx.throw(400, '用户名不能为空！');
    }

    if (!password) {
      ctx.throw(400, '密码不能为空！');
    }

    let result = await User
      .findOne({
        username
      })
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-findUser错误！');
      });

    if (result) {
      if (result.password === md5(password)) {
        let token = signToken(result._id);
        return ctx.success({
          msg: '登录成功！',
          data: {
            uid: result._id,
            name: result.name,
            username: result.username,
            createTime: result.createTime,
            token,
          },
          success: true
        });
      } else {
        return ctx.success({
          msg: '密码错误！',
          success: false
        });
      }
    } else {
      return ctx.success({
        msg: '用户名不存在！',
        success: false
      });
    }
  }

  // 用户退出（由前台控制即可）
  @Get('logout')
  @log
  async logout(ctx: any) {
    ctx.success({
      msg: '退出成功！',
      success: true
    });
  }

  // 更新用户资料
  @Put(':id')
  @log
  async updateUserMes(ctx: any) {
    ctx.success({
      msg: '通过！'
    });
  }

  // 重置密码
  @Put(':id')
  @log
  async resetPwd(ctx: any) {
    const uid = ctx.request.body.id;
    const password = md5(ctx.request.body.password);

    await User
      .findByIdAndUpdate(uid, {
        password
      })
      .exec()
      .catch(error => {
        ctx.throw(500, '服务器内部错误-modifyPwd错误！');
      });

    ctx.success({
      msg: '更新管理员密码成功！',
      success: true
    });
  }
}
