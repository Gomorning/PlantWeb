// 按需引入
// 这里的 install 方法表示在 main.js 中，如果使用 Vue.use() 方法的话，则该方法默认会调用 install 方法
import { Image, Form, Col, Dialog, FormItem, Input, Button, Card, Upload, DatePicker, Timeline, TimelineItem, Icon, Dropdown, DropdownItem, DropdownMenu, Message } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Card)
    Vue.use(Upload)
    Vue.use(DatePicker)
    Vue.use(Timeline)
    Vue.use(TimelineItem)
    Vue.use(Image)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Col)
    Vue.use(Dialog)
    Vue.use(Icon)
    Vue.use(Dropdown)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.component(Message.name, Message)
    Vue.prototype.$message = Message
  }
}
export default element
