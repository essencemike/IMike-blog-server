import Article from '../models/article';
import { Get, required, Controller, log, Post, Put, Delete } from '../middlewares/router';

@Controller('articles')
export default class ArticleController {

  // 创建文章
  @Post()
  @log
  async createArticle(ctx: any) {
    const {
      title,
      content,
      publish,
      tags,
      abstract
    } = ctx.request.body;
    const createTime = new Date();
    const lastEditTime = new Date();

    if (!title) {
      ctx.throw(400, '标题不能为空！');
    }

    if (!content) {
      ctx.throw(400, '内容不能为空！');
    }

    if (!abstract) {
      ctx.throw(400, '摘要不能为空！');
    }

    const article = new Article({
      title,
      content,
      abstract,
      publish,
      createTime,
      lastEditTime,
      tags
    });

    let result = await article.save().catch(error => {
      ctx.throw(500, '服务器内部错误-数据存储错误！');
    });
    await article.populate('tags').execPopulate().catch(() => {
      ctx.throw(500, '服务器内部错误-数据populate错误！');
    });

    ctx.success({
      msg: '文章创建成功！',
      data: result
    });
  }

  // 获取单个文章
  @Get(':id')
  @required({ params: 'id' })
  @log
  async getArticleById(ctx: any) {
    const id = ctx.params.id;
    let result = await Article.findById(id).catch(error => {
      ctx.throw(500, '服务器内部错误-数据查找错误！');
    });

    // await Article.populate('tags', []).execPopulate().catch(() => {
    //   ctx.throw(500, '服务器内部错误-数据populate错误！');
    // });

    ctx.success({
      msg: '查询成功！',
      data: result
    });
  }

  // 发布文章
  @Put(':id')
  @required({ params: 'id' })
  @log
  async ifPublishArticle(ctx: any) {
    const id = ctx.params.id;
    const publish = ctx.request.body.publish;
    if (publish !== true && publish !== false) {
      ctx.throw(400, 'publish字段不能为除true和false之外的值！');
    }

    let result = await Article.findByIdAndUpdate(id, {
      publish
    }, {
      new: true
    }).exec().catch(error => {
      ctx.throw(500, '服务器内部错误-updatePublish错误！');
    });

    ctx.success({
      msg: '更新publish成功！',
      data: result
    });
  }

  // 删除文章
  @Delete(':id')
  @required({ params: 'id' })
  @log
  async deleteArticleById(ctx: any) {
    const id = ctx.params.id;
    let result = await Article.findByIdAndRemove(id).exec().catch(error => {
      ctx.throw(500, '服务器内部错误-findByIdAndRemove错误！');
    });
    ctx.success({
        msg: '删除文章成功！',
        data: result
    });
  }

  // 修改文章： 不接受publish的修改
  @Put(':id')
  @required({ params: 'id' })
  @log
  async modifyArticle(ctx: any) {
    const {
      title,
      content,
      tags,
      abstract
    } = ctx.request.body;

    if (!title) {
      ctx.throw(400, '标题不能为空！');
    }

    if (!content) {
      ctx.throw(400, '内容不能为空！');
    }

    if (!abstract) {
      ctx.throw(400, '摘要不能为空！');
    }

    const lastEditTime = new Date();
    const id = ctx.params.id;
    let result = await Article.findByIdAndUpdate(id, {
      title,
      content,
      abstract,
      tags,
      lastEditTime,
    }, { new: true }).populate('tags').exec().catch(error => {
      ctx.throw(500, '服务器内部错误-findByIdAndUpdate错误！');
    });

    ctx.success({
      msg: '修改成功！',
      data: result
    });
  }

  // 获取所有文章（包含未发布文章，后台使用）
  @Get()
  @required({ query: ['tag', 'page', 'limit'] })
  @log
  async getAllArticles(ctx: any) {
    let tagId = ctx.query.tag;
    let page = +ctx.query.page;
    let limit = +ctx.query.limit || 5;

    if (page <= 0) {
      page = 1;
    }

    let result, total;

    // 只传了page参数
    if (tagId) {
      result = await Article.find({
        tags: tagId
      }).populate('tags').exec().catch(error => {
        ctx.throw(500, '内部服务器错误-根据标签查询文档错误！');
      });
    } else if (page && limit) {
      result = await Article
        .find()
        .sort({ 'createTime': -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate('tags')
        .exec()
        .catch(error => {
          ctx.throw(500, '服务器内部错误-分页查找错误！');
        });
      total = await Article
        .count({})
        .exec()
        .catch(() => {
          ctx.throw(500, '服务器内部错误-总数查询错误！');
        });
    } else {
      result = await Article
        .find()
        .sort({ 'createTime': -1 })
        .populate('tags')
        .exec()
        .catch(error => {
          ctx.throw(500, '服务器内部错误-查找所有文章错误！');
        });
    }

    ctx.success({
      msg: '查询文章成功！',
      data: result,
      total
    });
  }

  // 获取所有已发布的文章（前台使用）
  @Get('published')
  @required({ query: ['tag', 'page', 'limit'] })
  @log
  async getAllPublishedArticles(ctx: any) {
    let tagId = ctx.query.tag;
    let page = +ctx.query.page;
    let limit = +ctx.query.limit || 5;

    if (page <= 0) {
      page = 1;
    }

    let result, total;

    if (tagId) {  // 只传了page参数
      result = await Article
        .find({
          tags: tagId,   // { tags: {"$in": tagARR }}也行
          publish: true
        })
        .populate('tags')
        .exec()
        .catch(err => {
          ctx.throw(500, '服务器内部错误-根据标签查询文档错误!');
        });
    } else if (page && limit) {
      result = await Article
        .find({
          publish: true
        })
        .sort({ 'createTime': -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate('tags')
        .exec()
        .catch(err => {
          ctx.throw(500, '服务器内部错误-分页查找错误!');
        });

      total = await Article
        .count({})
        .exec()
        .catch(err => {
          ctx.throw(500, '服务器内部错误-总数查询错误!');
        });
    } else {  // 当没传递任何参数时，查询所有文章，包括发布和未发布的
      result = await Article
        .find({
          publish: true
        })
        .sort({ 'createTime': -1 })
        .populate('tags')
        .exec()
        .catch(err => {
          ctx.throw(500, '服务器内部错误-查找所有文章错误!');
        });

    }

    ctx.success({
      msg: '查询发布的文章成功！',
      data: result,
      total
    });
  }
}
