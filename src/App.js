/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Bricks from "bricks.js";
import "./App.css";

function getData(limit = 50, offset) {
  return Axios.get("https://musicapi.leanapp.cn/comment/music", {
    params: {
      id: 186016,
      limit,
      offset, // 倒叙
    },
  }).then((res) => res.data);
}

function dateFormat(timestamp, formats) {
  formats = formats || "Y-m-d";

  const zero = (value) => {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  const myDate = timestamp ? new Date(timestamp) : new Date();

  const year = myDate.getFullYear();
  const month = zero(myDate.getMonth() + 1);
  const day = zero(myDate.getDate());

  const hour = zero(myDate.getHours());
  const minite = zero(myDate.getMinutes());
  const second = zero(myDate.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches) {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second,
    }[matches];
  });
}

let page = 1;
let hotCommentInst;
let commentInst;
function App() {
  const [hotComments, setHotComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    getData(50, 2027450 - page * 50)
      .then((data) => {
        setComments(comments.concat(data.comments));
        page === 1 ? commentInst.pack() : commentInst.update();
        page++;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData(20).then((data) => {
      setHotComments(data.hotComments);
      hotCommentInst.pack();
    });
    loadMore();
    const sizeOpt = [
      { columns: 2, gutter: 10 },
      { mq: "600px", columns: 3, gutter: 10 },
      { mq: "800px", columns: 4, gutter: 10 },
      { mq: "1000px", columns: 5, gutter: 16 },
      { mq: "1130px", columns: 5, gutter: 16 },
    ];
    hotCommentInst = Bricks({
      container: "#hot-comment-list",
      packed: "data-packed",
      sizes: sizeOpt,
    });
    commentInst = Bricks({
      container: "#comment-list",
      packed: "data-packed",
      sizes: sizeOpt,
    });
  }, []);

  return (
    <div className="App">
      <h1 className="title">- 晴天の网易云评论 -</h1>
      <span className="github-button">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=objtube&repo=NeteaseMusic-qingtian-comment&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="170"
          height="30"
          title="GitHub"
        ></iframe>
      </span>
      <div style={{ textAlign: "center" }}>
        <iframe
          src="//player.bilibili.com/player.html?aid=328746951&bvid=BV1VA411e7PM&cid=208118542&page=1"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
          style={{ width: 800, height: 500 }}
        />
      </div>

      <h2 className="subtitle">热评 TOP15</h2>
      <div id="hot-comment-list">
        {hotComments.map(({ user, content, commentId, time }) => (
          <CommentCard
            key={commentId}
            avatarUrl={user.avatarUrl}
            nickname={user.nickname}
            content={content}
            time={time}
          />
        ))}
      </div>
      <h2 className="subtitle">评论回忆</h2>
      <div id="comment-list">
        {comments.map(({ user, content, commentId, time }) => (
          <CommentCard
            key={commentId}
            avatarUrl={user.avatarUrl}
            nickname={user.nickname}
            content={content}
            time={time}
          />
        ))}
      </div>
      <div className="load-more">
        <a className="load-more-button" onClick={loadMore}>
          {loading ? "..." : "加载更多"}
        </a>
      </div>
    </div>
  );
}

function CommentCard({ avatarUrl, nickname, content, time }) {
  return (
    <div className="grid-item" style={{ backgroundColor: "#fff" }}>
      <div className="userinfo">
        <img className="avatar" src={avatarUrl} alt="avatar" />
      </div>
      <div className="content">
        <span>{content}</span>
        <div className="nickname">- {nickname}</div>
        <div className="time">{dateFormat(time)}</div>
      </div>
    </div>
  );
}
export default App;
