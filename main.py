from paddleocr import PaddleOCR, draw_ocr
from PIL import Image
#from pillow import Image
import AES
from sqlalchemy import create_engine, String, Integer, Column, ForeignKey, Table, Sequence, Text, func, DECIMAL, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import json, requests
from flask import Flask, make_response, url_for, request, json, session, render_template, send_from_directory
from flask import request
from WXBizDataCrypt import WXBizDataCrypt

aes = AES.UseAES("zifuchuan")
q = aes.encrypt("呵呵")
print(q)
a = aes.decode_bytes(q)
print(a)

#db_name = 'mysql+mysqlconnector://root:chenyusen111@localhost:3306/cystql?auth_plugin=mysql_native_password'
db_name = 'mysql+mysqlconnector://root:chenyusen111@localhost:3306/cystql?auth_plugin=mysql_native_password'
Base = declarative_base()
app = Flask(__name__)


class Service(Base):
    __tablename__ = 'servie'
    id = Column(Integer, primary_key=True)
    type = Column(String(50), nullable=False, index=True)
    price = Column(String(50))


# Paddleocr目前支持中英文、英文、法语、德语、韩语、日语，可以通过修改lang参数进行切换
# 参数依次为`ch`, `en`, `french`, `german`, `korean`, `japan`。

ocr = PaddleOCR(use_angle_cls=True, lang="ch")  # need to run only once to download and load model into memory

img_path = '111111.jpg'
result = ocr.ocr(img_path, cls=True)

for i in result:
    print(i)

image = Image.open(img_path).convert('RGB')
boxes = [line[0] for line in result]
txts = [line[1][0] for line in result]
scores = [line[1][1] for line in result]

im_show = draw_ocr(image, boxes, font_path='/path/to/PaddleOCR/doc/fonts/simfang.ttf')
im_show = Image.fromarray(im_show)
im_show.save('resultx1.jpg')

image = Image.open(img_path).convert('RGB')
boxes = [line[0] for line in result]
# txts = [line[1][0] for line in result]
# scores = [line[1][1] for line in result]

im_show = draw_ocr(image, boxes, txts, scores, font_path='/path/to/PaddleOCR/doc/fonts/simfang.ttf')
im_show = Image.fromarray(im_show)
im_show.save('result1.jpg')

im_show = draw_ocr(image, boxes, txts, font_path='/path/to/PaddleOCR/doc/fonts/simfang.ttf')
im_show = Image.fromarray(im_show)
im_show.save('result2.jpg')


class User(Base):
    __tablename__ = 'User'
    user_id = Column(Integer, primary_key=True)


class Picture_one_result(Base):
    __tablename__ = 'Picture_one_result'
    picture_one_result_id = Column(Integer, primary_key=True)
    card_id = Column(Integer)
    one_result = Column(String(50))
    picture_result_id = Column(Integer)


class Picture_result(Base):
    __tablename__ = 'Picture_result'
    picture_result_id = Column(Integer, primary_key=True)
    picture_id = Column(Integer)
    order_id = Column(Integer)


class Order(Base):
    __tablename__ = 'Order'
    order_id = Column(Integer, primary_key=True)
    strategy_id = Column(Integer)
    picture_group_id = Column(Integer)
    user_id = Column(Integer)
    upload_time = Column(String(50))


class Picture(Base):
    __tablename__ = 'Picture'
    picture_id = Column(Integer, primary_key=True)
    picture_url = Column(String(200))
    picture_group_id = Column(Integer)


class Picture_group(Base):
    __tablename__ = 'Picture_group'
    picture_group_id = Column(Integer, primary_key=True)
    eg_picture_id = Column(Integer)
    upload_time = Column(String(200))
    user_id = Column(Integer)


class Strategy(Base):
    __tablename__ = 'Strategy'
    strategy_id = Column(Integer, primary_key=True)
    strategy_name = Column(String(50))
    upload_time = Column(String(200))
    user_id = Column(Integer)


class User_strategy(Base):
    __tablename__ = 'User_strategy'
    user_strategy_id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    strategy_id = Column(Integer)
    user_strategy_relationship = Column(String(50))


class Location(Base):
    __tablename__ = 'Location'
    loc_method = Column(String(50), primary_key=True)
    loc_input1 = Column(String(50))
    loc_input2 = Column(String(50))
    loc_input3 = Column(String(50))
    loc_input4 = Column(String(50))
    card_id = Column(Integer)


class Card_id(Base):
    __tablename__ = 'Card_id'
    card_id = Column(Integer, primary_key=True)
    is_row = Column(String(50))
    row_start = Column(Integer)
    row_end = Column(Integer)
    row_font = Column(String(50))
    is_line = Column(String(50))
    line_start = Column(Integer)
    line_end = Column(Integer)
    line_font = Column(String(50))
    strategy_id = Column(Integer)


class Change_font(Base):
    __tablename__ = 'Change_font'
    change_font_id = Column(Integer, primary_key=True)
    change_font_method = Column(String(50))
    change_font_input1 = Column(String(50))
    change_font_input2 = Column(String(50))
    card_id = Column(Integer)


def ifinsquare(x, y, square):
    if square[0][0] <= x <= square[1][0]:
        if square[1][1] < y <= square[2][1]:
            print("in", x, y, square)
            return True
    return False


def point_located(x, y, result):
    for i in result:
        if ifinsquare(x, y, i[0]):
            return i
    return None


def keyword(s, result, times):
    now_t = 0
    for i in result:
        now = i[1][0].find(s)
        if now > -1:
            now_t = now_t + 1
            if times == now_t:
                return i
    return None


def font_size(i):
    the_len_x = (i[0][2][0] - i[0][0][0]) / len(i[1][0])
    the_len_y = i[0][2][1] - i[0][0][1]
    print(the_len_x, the_len_y)
    the_len = [the_len_x, the_len_y]
    return the_len


def font_loc(i):
    font_loc = font_size(i)
    x = i[0][0][0] + font_loc[0] / 2
    y = i[0][0][1] + font_loc[1] / 2
    str_loc = [x, y]
    return str_loc


def find_relevent_locate(start, x, y):
    if start is None:
        return None

    loc_start = font_loc(start)
    print(loc_start)

    loc_start[0] = loc_start[0] + x * font_size(start)[0]
    loc_start[1] = loc_start[1] + y * font_size(start)[1]
    print(loc_start)

    end_with = point_located(loc_start[0], loc_start[1], result)
    if end_with is not None:
        return end_with
    else:
        return None


def txt_replace(i, current):
    list1 = [i[0], tuple([current, i[1][1]])]
    return list1


def add(i, front_or_end, add_str):
    current = i[1][0]
    if front_or_end == 'front':
        current = add_str + " " + i[1][0]
    elif front_or_end == 'end':
        current = i[1][0] + " " + add_str
    return txt_replace(i, current)


def replace(i, replace_from, replace_to):
    current = i[1][0].replace(replace_from, replace_to)
    print(replace_from, replace_to, current)
    return txt_replace(i, current)


def delete(i, delete_choice, delete):
    if delete_choice == '无':
        current = i[1][0].replace(delete, "")
    elif delete_choice == '仅数字':
        current = i[1][0].replace(delete, "")
    elif delete_choice == '删除字符':
        current = i[1][0].replace(delete, "")
    return txt_replace(i, current)


def right_midpoint(i):
    midpoint_x = (i[0][2][0] + i[0][1][0]) / 2
    midpoint_y = (i[0][2][1] + i[0][1][1]) / 2
    midpoint = [midpoint_x, midpoint_y]
    return midpoint


def row_line(i, x_max, y_max, add_x, add_y):
    x_scanned = 0.3
    y_scanned = 0.3
    point_x = right_midpoint(i)[0]
    point_y = right_midpoint(i)[1]

    count = 0
    current = i[1][0]
    found = True
    next_y = i[0][3][1]
    font_x = font_size(i)[0]
    font_y = font_size(i)[1]

    limited_x = right_midpoint(i)[0] + font_x * x_max
    limited_y = i[0][3][1] + font_y * y_max

    while point_y <= limited_y:
        while point_x <= limited_x:
            point_x = point_x + font_x * x_scanned
            count = count + 1
            now_line = point_located(point_x, point_y, result)
            if now_line is not None:
                if count >= 3:
                    if found:
                        current = current + add_x + now_line[1][0]
                    else:
                        current = current + add_y + now_line[1][0]
                        found = True
                count = 0
                point_x = right_midpoint(now_line)[0]
                next_y = now_line[0][3][1]

        point_x = i[0][3][0]
        count = 0
        if found:
            point_y = next_y
        found = False

        point_y = point_y + font_y * y_scanned
        print(point_x, point_y, font_x, font_y, limited_y, limited_x)
    print(i, current)
    tupi = txt_replace(i, current)
    print(tupi)
    return tupi


print(" ")
print(point_located(127, 20, result))
print(keyword("姓名", result, 1))
print(find_relevent_locate(keyword("姓名", result, 1), 1, 1))
print(add(keyword("姓名", result, 1), "end", "猫猫"))
print(replace(keyword("姓名", result, 1), "姓", "猫"))
print(delete(keyword("姓名", result, 1), "无", "姓"))
print(row_line(keyword("疫苗名称", result, 1), 6, 2, " ", " "))

if __name__ == '__main__':

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        data = json.loads(request.get_data().decode('utf-8'))  # 将前端Json数据转为字典
        appID = 'wxcc11c38a511a6dfc'  # 开发者关于微信小程序的appID
        appSecret = 'b38230946a064365de95aa2712a89407'  # 开发者关于微信小程序的appSecret
        code = data['platCode']  # 前端POST过来的微信临时登录凭证code
        encryptedData = data['platUserInfoMap']['encryptedData']
        iv = data['platUserInfoMap']['iv']
        req_params = {
            'appid': appID,
            'secret': appSecret,
            'js_code': code,
            'grant_type': 'authorization_code'
        }
        wx_login_api = 'https://api.weixin.qq.com/sns/jscode2session'
        response_data = requests.get(wx_login_api, params=req_params)  # 向API发起GET请求
        resData = response_data.json()
        print(resData)
        openid = resData['openid']  # 得到用户关于当前小程序的OpenID
        session_key = resData['session_key']  # 得到用户关于当前小程序的会话密钥session_key
        print(openid)
        if openid and session_key:
            pc = WXBizDataCrypt(appID, session_key)  # 对用户信息进行解密
            userinfo = pc.decrypt(encryptedData, iv)  # 获得用户信息
            id = 1
            uid = 1
            print(userinfo)
            return json.dumps(
                {"code": 200, 'nid': 1, "money": 500, "id": uid, "msg": "登录成功", "userInfo": userinfo},
                indent=4, sort_keys=True, default=str, ensure_ascii=False)
        return "sorry"


    @app.route('/price', methods=['GET'])
    def price():
        engine = create_engine(db_name)
        Session = sessionmaker(bind=engine)
        session = Session()
        print(request)
        print(request.args)
        name = request.args.get("nishisha")  # 得到小程序上传的变量“你是谁” 这里加个if就可以判断是否是合法请求啦，不是hehe的都是坏人
        print(name)
        data = []
        for c in session.query(Service).all():
            print(c.id, c.type, c.price)
            data.append({"before": c.type, "after": c.price})
        session.close()
        engine.dispose()
        print(data)
        return json.dumps({'code': 1, 'data': data})


    @app.route('/price1', methods=['GET'])
    def price1():
        print(request)
        print(request.args)
        name = request.args.get("nishisha")  # 得到小程序上传的变量“你是谁” 这里加个if就可以判断是否是合法请求啦，不是hehe的都是坏人
        print(name)
        return "123"


    print(123)
    app.run(host='0.0.0.0', port=8001)



