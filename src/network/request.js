import axios from "axios";

export function request(config) {
  //1.创建axios的实例
  const instance = axios.create({
    baseURL: "http://152.136.185.210:7878/api/m5",
    timeout: 5000,
  });

  //2.axios的拦截器
  //2.1请求拦截的作用
  instance.interceptors.request.use(
    (config) => {
      // console.log(config);
      return config;
    },
    (err) => {
      console.log(err);
    }
  );

  //2.2拦截响应
  instance.interceptors.response.use(
    (res) => {
      // console.log(res);
      return res.data;
    },
    (err) => {
      console.log(err);
    }
  );

  //发送真正的网络请求
  return instance(config);
}
