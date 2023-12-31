from flask import Flask, request, render_template
import magic

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file_type = get_file_type(file)
            if file_type == 'text':
                save_to_text_server(file)
            elif file_type == 'image':
                save_to_image_server(file)
            return "File uploaded successfully!"
    return render_template('upload.html')

def get_file_type(file):
    mime = magic.Magic()
    file_type = mime.from_buffer(file.read(1024))  # 读取文件头部信息判断类型
    file.seek(0)  # 将文件指针重置到文件开头
    if 'text' in file_type:
        return 'text'
    elif 'image' in file_type:
        return 'image'
    else:
        return 'unknown'

def save_to_text_server(file):
    # 实现将文件保存到文字信息服务器的逻辑
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'text_files', file.filename))

def save_to_image_server(file):
    # 实现将文件保存到图像信息服务器的逻辑
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'image_files', file.filename))

if __name__ == '__main__':
    app.run(debug=True)
