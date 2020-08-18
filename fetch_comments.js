/**
 * 这个文件的代码是为了获取所有评论内容，然后保存在一个json文件里。
 * 这样网页端就可以实现搜索评论的功能。
 * 但发现只能查前1000个评论内容和后1000个，中间的都返回空数组，暂时还没有解决。
 */
const Axios = require("axios");
const fs = require("fs");

const TOTAL = 2027400;

function getData(limit = 50, offset, before) {
  return Axios.get("https://musicapi.leanapp.cn/comment/music", {
    params: {
      id: 186016,
      limit,
      offset,
      before,
    },
  }).then((res) => res.data);
}

let times = TOTAL / 50;
const commentMap = {};
let page = 1;
async function recursive(before) {
  if (page === times) {
    fs.writeFileSync("./commentData.json", JSON.stringify(commentMap, null, 2));
    return;
  }
  let _before;
  try {
    const { comments } = await getData(50, 50 * (page - 1), before);
    console.log(`第${page}次请求  共有${comments.length}条评论`);
    comments.forEach(({ user, time, content }) => {
      if (commentMap[user.userId]) {
        commentMap[user.userId].push({
          nickname: user.nickname,
          time,
          content,
        });
      } else {
        commentMap[user.userId] = [
          {
            nickname: user.nickname,
            time,
            content,
          },
        ];
      }
    });
    _before = comments[comments.length - 1].time;
  } catch (error) {
    console.log(error);
  }
  page++;
  await recursive(_before);
}
recursive();
