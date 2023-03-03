const Mock = require("mockjs");

const List = [];
const count = 100;

const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri =
  "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3";

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@name(5, 10)",
      doctor: "@doctor(5, 10)",
      num: "@integer(10000000, 90000000)",
      card: "@integer(100000000, 900000000)",
      age: "@integer(1, 200)",
      accout: "@integer(3000, 4000)",
      //'orderStatus|1': ['已支付', '未支付'],
      orderStatus: "@integer(0, 2)",
      serviceStatus: "@integer(0, 2)",
      //serviceStatus: '@integer(1, 3)',
      "serviceStatus|1": ["已支付", "未支付"],
      "sex|1": ["男", "女"],
      timestamp: +Mock.Random.date("T"),
      author: "@first",
      reviewer: "@first",
      title: "@title(5, 10)",
      content_short: "mock data",
      content: baseContent,
      forecast: "@float(0, 100, 2, 2)",
      importance: "@integer(1, 3)",
      "type|1": ["CN", "US", "JP", "EU"],
      "status|1": ["published", "draft"],
      display_time: "@datetime",
      comment_disabled: true,
      pageviews: "@integer(300, 5000)",
      image_uri,
      platforms: ["a-platform"]
    })
  );
}

module.exports = [
  {
    url: "/vue-element-admin/orderlist/list",
    type: "get",
    response: config => {
      const {
        importance,
        type,
        title,
        page = 1,
        limit = 20,
        sort
      } = config.query;

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false;
        if (type && item.type !== type) return false;
        if (title && item.title.indexOf(title) < 0) return false;
        return true;
      });

      if (sort === "-id") {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      };
    }
  },

  {
    url: "/vue-element-admin/orderlist/detail",
    type: "get",
    response: config => {
      const { id } = config.query;
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 200,
            data: article
          };
        }
      }
    }
  },
  {
    url: "/vue-element-admin/orderlist/update",
    type: "post",
    response: _ => {
      return {
        code: 200,
        data: "success"
      };
    }
  }
];
