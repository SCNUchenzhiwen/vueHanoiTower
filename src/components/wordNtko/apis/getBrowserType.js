/**
 * 获取浏览器信息
 */

const getBrowserType = () => {
  let ua = navigator.userAgent.toLowerCase();
  let sys = {}
  ua.match(/msie ([\d.]+)/) ? sys.ie = 1 :
    ua.match(/mozilla\/([\d.]+)/) ? sys.ie = 1 :
      ua.match(/firefox\/([\d.]+)/) ? sys.firefox = 1 :
        ua.match(/chrome\/([\d.]+)/) ? sys.chrome = 1 :
          ua.match(/opera.([\d.]+)/) ? sys.opera = 1 :
            ua.match(/version\/([\d.]+).*safari/) ? sys.safari = 1 : 0;
  console.log('sysy')
  console.log(sys)
  return sys
}

export default getBrowserType
