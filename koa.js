const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');

router.post('/upload', koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  }),
  (ctx) => {
    console.log(ctx.request.files);
    // => POST body
    ctx.body = JSON.stringify(ctx.request.files);
  }
);

app.use(router.routes());

app.listen(3001);

// router.post('/upload', koaBody(), (ctx) => {
//   const file = ctx.request.body.files.file; // 获取上传文件
//   const reader = fs.createReadStream(file.path); // 创建可读流
//   const ext = file.name.split('.').pop(); // 获取上传文件扩展名
//   const upStream = fs.createWriteStream(`upload/${Math.random().toString()}.${ext}`); // 创建可写流
//   reader.pipe(upStream); // 可读流通过管道写入可写流
//   console.log('保存成功')
//   return ctx.body = '上传成功';
// })

app.use(router.routes())
  .use(router.allowedMethods());
