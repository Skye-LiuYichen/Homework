from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
import shutil

app = FastAPI()


@app.post("/upload_image/")
async def upload_image(image: UploadFile = File(...), openid: str = Form()):
    print(openid)
    print('ok')
    file_bytes = image.file.read()
    tempfile = 'test.jpg'
    with open(tempfile, 'wb') as f:
        f.write(file_bytes)
    return JSONResponse(content={'result':"OK"})

@app.get("/get_image")
async def get_image():
    image_path = r"D:\PythonCodes\wirelessCommu\output.jpg"
    return FileResponse(image_path, media_type="image/jpeg")

@app.post("/upload_message_v2/")
async def upload_message(image: UploadFile = File(...), message: str = Form()):
    # 将上传的图片保存到本地
    file_bytes = image.file.read()
    tempfile = 'test2.jpg'
    with open(tempfile, 'wb') as f:
        f.write(file_bytes)
    print('image ok')
    path_img = 'D:/PythonCodes/wirelessCommu'
    shutil.copy(path_img + '/' + "test2.jpg", "D:/PythonCodes/wirelessCommu/folder/" + "test2.jpg")
    shutil.move(path_img + '/' + "test2.jpg", "D:/PythonCodes/wirelessCommu/img/" + "test2.jpg")

    # 对消息进行解密并打印出来
    decrypted_message = decrypt_message(message)
    print('解密后的消息：', decrypted_message)


    file_path =  r'D:\PythonCodes\wirelessCommu\text\text.txt'
    file_path2 = r'D:\PythonCodes\wirelessCommu\folder\text.txt'


    save_str_to_file(decrypted_message, file_path)
    save_str_to_file(decrypted_message, file_path2)



    # 返回一个 JSON 响应
    return JSONResponse(content={'result': 'OK'})


# 解密函数
def decrypt_message(encrypted_message):
    decrypted_message = ''
    for char in encrypted_message:
        decrypted_message += chr(ord(char) ^ 0xF0)
    return decrypted_message

def save_str_to_file(string, file_path):
    with open(file_path, 'w') as file:
        file.write(string)
