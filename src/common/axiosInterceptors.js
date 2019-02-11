import axios from "axios";

axios.interceptors.response.use(function (response) {
    const { data } = response.data;
    /**
     * 这里可以根据和后台的约定去判断执行一些逻辑，暂时没有，此处省略
     */
    // Do something before request is sent
    //console.log("response", response);
    return response;
}, function (error) {
    console.log("error拦截器", error.response);
    // Do something with request error
    if(error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = error.response.data.message;
                break;
            case 500:
                error.message = error.response.data.message;
                break;
            case 504:
                error.message = "登录已失效，请重新登录";
                break;
        }
    } else {
        error.message = "数据获取失败";
    }
    return Promise.reject(error);
});

