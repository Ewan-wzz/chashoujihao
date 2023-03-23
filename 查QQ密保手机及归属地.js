import plugin from '../../lib/plugins/plugin.js'
import {segment} from "oicq";
import fetch from "node-fetch";
import lodash from 'lodash'
//一个老社工库查一下密保手机，归属地
//仿写，第一次写javascript不是很会

//1.定义命名规则
export class chashoujihao extends plugin {
    constructor(){
        super({
            /**功能名称*/
            name: '查QQ密保手机及归属地',
            dsc: '简单开发示例',
      	    /** https://oicqjs.github.io/oicq/#events */
      	    event: 'message',
      	    /** 优先级，数字越小等级越高 */
      	    priority: 50000,
            rule: [
                {
                    /**命令正则匹配*/
                    reg: "^#*查手机号(.*)$",
                    /**执行方法*/
                    fnc: 'chashoujihao'
                },
            ]
        })
    }
    //2.执行方法
    async chashoujihao(e) {
        const at = e.message.find(item => item.type === 'at' && item.qq === e.self_id);
        let qq = e.message.filter(item => item.type == 'at')?.map(item => item?.qq)
        console.log(qq);
        if (lodash.isEmpty(qq)) {
            qq = e.msg.match(/\d+/g)
        }
        if (!qq) qq = [e.user_id]
        for (let i of qq) {
            let url = `https://zy.xywlapi.cc/qqapi?qq=${i}`;
            let response = await fetch(url);
            let res = await response.json();
            let message = `QQ:${i}\n`+`查询状态：${segment.text(res.message)}\n` +`绑定的号码:${segment.text(res.phone)}\n`+`地区:${segment.text(res.phonediqu)}\n`+`不要做坏事哦!`;
             await e.reply(`@${e.user_id}`, message);
        }
        return true; //返回true阻挡消息不再往下
    }
}
