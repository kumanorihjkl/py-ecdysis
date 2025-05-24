export interface Tutorial {
  id: string;
  title: string;
  content: string;
  code: string;
  exercise?: string;
  testCode?: string;
}

export const tutorials: Tutorial[] = [
  {
    id: 'intro',
    title: 'Pythonへようこそ',
    content: `
# Pythonプログラミングへようこそ！

Pythonは、シンプルで読みやすい構文を持つプログラミング言語です。
このチュートリアルでは、Pythonの基本を学んでいきます。

## はじめに

Pythonでは、\`print()\`関数を使って画面に文字を表示できます。
右のコードを実行してみましょう！

**実行方法:**
- 「実行」ボタンをクリック
- または、Cmd/Ctrl + Enter キーを押す
`,
    code: `# はじめてのPythonプログラム
print("Hello, Python!")
print("プログラミングを始めましょう！")`,
  },
  {
    id: 'variables',
    title: '変数とデータ型',
    content: `
# 変数とデータ型

Pythonでは、変数を使ってデータを保存できます。

## 基本的なデータ型

- **整数 (int)**: 1, 42, -10
- **浮動小数点数 (float)**: 3.14, -0.5
- **文字列 (str)**: "Hello", 'Python'
- **真偽値 (bool)**: True, False

変数名は分かりやすい名前をつけましょう！
`,
    code: `# 変数の定義
name = "Python"
age = 30
pi = 3.14159
is_fun = True

# 変数の表示
print(f"言語: {name}")
print(f"年齢: {age}歳")
print(f"円周率: {pi}")
print(f"楽しい？: {is_fun}")

# 型の確認
print(f"nameの型: {type(name)}")
print(f"ageの型: {type(age)}")`,
    exercise: `
変数 \`temperature\` に今日の気温（数値）を代入し、
「今日の気温は〇〇度です」と表示してみましょう。
`,
  },
  {
    id: 'lists',
    title: 'リストと繰り返し',
    content: `
# リストと繰り返し

リストは複数の値をまとめて扱うためのデータ構造です。

## リストの基本操作

- 要素の追加: \`append()\`
- 要素の削除: \`remove()\`
- 要素数の取得: \`len()\`

## for文による繰り返し

\`for\`文を使うと、リストの各要素に対して処理を実行できます。
`,
    code: `# リストの作成
fruits = ["りんご", "バナナ", "オレンジ"]
print(f"フルーツリスト: {fruits}")

# 要素の追加
fruits.append("ぶどう")
print(f"追加後: {fruits}")

# リストの長さ
print(f"フルーツの数: {len(fruits)}")

# for文で繰り返し
print("\\nフルーツ一覧:")
for fruit in fruits:
    print(f"- {fruit}")

# インデックスと一緒に表示
print("\\n番号付きリスト:")
for i, fruit in enumerate(fruits):
    print(f"{i+1}. {fruit}")`,
    exercise: `
好きな食べ物を5つ以上含むリストを作成し、
それぞれの食べ物について「〇〇が好きです」と表示してみましょう。
`,
  },
  {
    id: 'functions',
    title: '関数の定義',
    content: `
# 関数の定義

関数を使うと、処理をまとめて再利用できます。

## 関数の基本構文

\`\`\`python
def 関数名(引数):
    処理
    return 戻り値
\`\`\`

## 引数と戻り値

- 引数: 関数に渡す値
- 戻り値: 関数から返される値
`,
    code: `# 基本的な関数
def greet(name):
    """挨拶をする関数"""
    return f"こんにちは、{name}さん！"

# 関数の呼び出し
message = greet("太郎")
print(message)

# 複数の引数を持つ関数
def calculate_area(width, height):
    """長方形の面積を計算する"""
    area = width * height
    return area

# 面積の計算
w = 10
h = 5
result = calculate_area(w, h)
print(f"幅{w}、高さ{h}の長方形の面積: {result}")

# デフォルト引数
def introduce(name, age=20):
    """自己紹介をする関数"""
    return f"私は{name}です。{age}歳です。"

print(introduce("花子"))
print(introduce("次郎", 25))`,
    exercise: `
2つの数値を受け取って、その平均値を返す関数 \`calculate_average\` を作成してみましょう。
作成した関数を使って、いくつかの数値の平均を計算してください。
`,
  },
  {
    id: 'conditions',
    title: '条件分岐',
    content: `
# 条件分岐

\`if\`文を使うと、条件に応じて異なる処理を実行できます。

## 比較演算子

- \`==\`: 等しい
- \`!=\`: 等しくない
- \`<\`, \`>\`: より小さい、より大きい
- \`<=\`, \`>=\`: 以下、以上

## 論理演算子

- \`and\`: かつ
- \`or\`: または
- \`not\`: ではない
`,
    code: `# 基本的なif文
age = 18

if age >= 20:
    print("成人です")
else:
    print("未成年です")

# elif を使った複数条件
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"スコア{score}点の評価: {grade}")

# 複数条件の組み合わせ
temperature = 25
humidity = 60

if temperature >= 25 and humidity >= 60:
    print("蒸し暑いです")
elif temperature >= 25:
    print("暑いです")
elif temperature <= 10:
    print("寒いです")
else:
    print("過ごしやすいです")`,
    exercise: `
BMI計算プログラムを作成してください。
体重(kg)と身長(m)から BMI = 体重 / (身長 ** 2) を計算し、
以下の基準で判定してください：
- BMI < 18.5: やせ型
- 18.5 <= BMI < 25: 標準
- 25 <= BMI: 肥満
`,
  },
  {
    id: 'dictionaries',
    title: '辞書型',
    content: `
# 辞書型（Dictionary）

辞書型は、キーと値のペアでデータを管理するデータ構造です。

## 辞書の特徴

- キーを使って値にアクセス
- キーは一意である必要がある
- 値は任意のデータ型が使える

## よく使うメソッド

- \`keys()\`: すべてのキーを取得
- \`values()\`: すべての値を取得
- \`items()\`: キーと値のペアを取得
`,
    code: `# 辞書の作成
student = {
    "name": "山田太郎",
    "age": 20,
    "major": "コンピュータサイエンス",
    "grades": {"math": 85, "english": 92, "science": 78}
}

# 値へのアクセス
print(f"名前: {student['name']}")
print(f"専攻: {student['major']}")

# ネストした辞書へのアクセス
print(f"数学の成績: {student['grades']['math']}")

# 値の更新
student['age'] = 21
print(f"更新後の年齢: {student['age']}")

# 新しいキーの追加
student['email'] = "yamada@example.com"
print(f"メール: {student['email']}")

# すべてのキーと値を表示
print("\\n学生情報:")
for key, value in student.items():
    if key != 'grades':
        print(f"  {key}: {value}")

# 成績の平均を計算
grades = student['grades']
average = sum(grades.values()) / len(grades)
print(f"\\n成績の平均: {average:.1f}点")`,
    exercise: `
商品の在庫管理システムを作ってみましょう。
商品名をキー、在庫数を値とする辞書を作成し、
- 全商品の一覧表示
- 在庫の合計数
- 在庫が5個以下の商品の警告
を実装してください。
`,
  },
  {
    id: 'file_operations',
    title: 'ファイル操作',
    content: `
# ファイル操作

Pythonでは、ファイルの読み書きが簡単にできます。

## ファイルを開くモード

- \`'r'\`: 読み込み（デフォルト）
- \`'w'\`: 書き込み（上書き）
- \`'a'\`: 追記
- \`'x'\`: 新規作成（ファイルが存在するとエラー）

## with文の使用

\`with\`文を使うと、ファイルの自動クローズが保証されます。
`,
    code: `# ファイルへの書き込み
data = ["Python", "JavaScript", "Java", "C++", "Ruby"]

# ファイルに書き込む
with open("languages.txt", "w", encoding="utf-8") as f:
    f.write("プログラミング言語一覧\\n")
    f.write("=" * 20 + "\\n")
    for lang in data:
        f.write(f"- {lang}\\n")

print("ファイルを作成しました")

# ファイルから読み込む
print("\\nファイルの内容:")
with open("languages.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 行ごとに読み込む
print("行ごとの処理:")
with open("languages.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        print(f"{i+1}: {line.strip()}")

# CSVファイルの作成
import csv

students = [
    ["名前", "年齢", "成績"],
    ["田中", 20, 85],
    ["佐藤", 21, 92],
    ["鈴木", 19, 78]
]

with open("students.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(students)

print("\\nCSVファイルを作成しました")`,
    exercise: `
TODOリストをファイルに保存するプログラムを作成してください。
- ユーザーからTODO項目を入力
- ファイルに保存
- ファイルから読み込んで表示
`,
  },
  {
    id: 'error_handling',
    title: 'エラー処理',
    content: `
# エラー処理

プログラムのエラーを適切に処理することで、安定したアプリケーションを作れます。

## try-except文

予期されるエラーをキャッチして、適切に処理します。

## よくあるエラー

- \`ValueError\`: 不適切な値
- \`TypeError\`: 型の不一致
- \`FileNotFoundError\`: ファイルが見つからない
- \`ZeroDivisionError\`: ゼロ除算
`,
    code: `# 基本的なエラー処理
def divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("エラー: ゼロで除算することはできません")
        return None

# 正常な除算
print(f"10 ÷ 2 = {divide(10, 2)}")

# ゼロ除算
print(f"10 ÷ 0 = {divide(10, 0)}")

# 複数のエラーを処理
def get_number():
    while True:
        try:
            num = input("数値を入力してください: ")
            return int(num)
        except ValueError:
            print("エラー: 有効な数値を入力してください")

# ファイル操作のエラー処理
def read_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"エラー: ファイル '{filename}' が見つかりません")
        return None
    except Exception as e:
        print(f"予期しないエラー: {e}")
        return None

# 存在しないファイルを読み込む
content = read_file("nonexistent.txt")

# finally節の使用
def process_data():
    try:
        print("データ処理を開始...")
        # 何か処理
        result = 10 / 2
        print(f"結果: {result}")
    except Exception as e:
        print(f"エラー発生: {e}")
    finally:
        print("処理を終了します")

process_data()`,
    exercise: `
年齢を入力してもらい、以下の処理を行うプログラムを作成してください：
- 数値以外が入力されたらエラーメッセージを表示
- 負の数が入力されたらエラーメッセージを表示
- 150以上の数が入力されたらエラーメッセージを表示
- 正しい年齢が入力されたら「〇〇歳ですね」と表示
`,
  },
  {
    id: 'classes',
    title: 'クラスとオブジェクト',
    content: `
# クラスとオブジェクト

クラスを使うと、データと機能をまとめて管理できます。

## クラスの基本

- クラス: オブジェクトの設計図
- インスタンス: クラスから作られた実体
- メソッド: クラス内の関数
- 属性: クラス内の変数

## 特殊メソッド

- \`__init__\`: コンストラクタ（初期化）
- \`__str__\`: 文字列表現
`,
    code: `# クラスの定義
class Student:
    """学生を表すクラス"""
    
    def __init__(self, name, age, student_id):
        self.name = name
        self.age = age
        self.student_id = student_id
        self.grades = {}
    
    def add_grade(self, subject, score):
        """成績を追加する"""
        self.grades[subject] = score
    
    def get_average(self):
        """平均点を計算する"""
        if not self.grades:
            return 0
        return sum(self.grades.values()) / len(self.grades)
    
    def __str__(self):
        """文字列表現"""
        return f"{self.name} (ID: {self.student_id})"

# インスタンスの作成
student1 = Student("田中太郎", 20, "S001")
student2 = Student("佐藤花子", 21, "S002")

# メソッドの使用
student1.add_grade("数学", 85)
student1.add_grade("英語", 92)
student1.add_grade("理科", 78)

print(f"学生: {student1}")
print(f"成績: {student1.grades}")
print(f"平均点: {student1.get_average():.1f}")

# 継承の例
class GraduateStudent(Student):
    """大学院生を表すクラス"""
    
    def __init__(self, name, age, student_id, research_topic):
        super().__init__(name, age, student_id)
        self.research_topic = research_topic
    
    def __str__(self):
        return f"{super().__str__()} - 研究テーマ: {self.research_topic}"

# 大学院生のインスタンス
grad_student = GraduateStudent("山田次郎", 24, "G001", "機械学習")
print(f"\\n大学院生: {grad_student}")`,
    exercise: `
図書館の本を管理するBookクラスを作成してください：
- 属性: タイトル、著者、ISBN、貸出中かどうか
- メソッド: 貸出、返却、情報表示
複数の本を作成して、貸出・返却の操作を試してみましょう。
`,
  },
  {
    id: 'modules',
    title: 'モジュールとパッケージ',
    content: `
# モジュールとパッケージ

Pythonの豊富なライブラリを活用することで、効率的にプログラムを作成できます。

## 標準ライブラリ

Pythonには多くの便利なモジュールが標準で含まれています。

## import文

- \`import module\`: モジュール全体をインポート
- \`from module import function\`: 特定の関数をインポート
- \`import module as alias\`: エイリアスを使用
`,
    code: `# 標準ライブラリの使用
import math
import random
import datetime
from collections import Counter

# mathモジュール
print("=== 数学関数 ===")
print(f"円周率: {math.pi}")
print(f"平方根: √16 = {math.sqrt(16)}")
print(f"三角関数: sin(π/2) = {math.sin(math.pi/2)}")

# randomモジュール
print("\\n=== ランダム ===")
print(f"ランダムな整数 (1-10): {random.randint(1, 10)}")
print(f"ランダムな小数 (0-1): {random.random():.3f}")

fruits = ["りんご", "バナナ", "オレンジ", "ぶどう"]
print(f"ランダムに選択: {random.choice(fruits)}")

# datetimeモジュール
print("\\n=== 日時 ===")
now = datetime.datetime.now()
print(f"現在の日時: {now}")
print(f"今日の日付: {now.date()}")
print(f"現在の時刻: {now.time()}")

# 日付の計算
tomorrow = now + datetime.timedelta(days=1)
print(f"明日: {tomorrow.date()}")

# collectionsモジュール
print("\\n=== コレクション ===")
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_count = Counter(words)
print(f"単語の出現回数: {dict(word_count)}")
print(f"最も多い単語: {word_count.most_common(1)}")

# 自作モジュールの例
def create_utils_module():
    """utilsモジュールを作成する例"""
    utils_code = '''
def celsius_to_fahrenheit(celsius):
    """摂氏を華氏に変換"""
    return celsius * 9/5 + 32

def fahrenheit_to_celsius(fahrenheit):
    """華氏を摂氏に変換"""
    return (fahrenheit - 32) * 5/9

def is_prime(n):
    """素数判定"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
'''
    with open("utils.py", "w", encoding="utf-8") as f:
        f.write(utils_code)
    print("utilsモジュールを作成しました")

create_utils_module()`,
    exercise: `
以下の機能を持つ独自のモジュールを作成してください：
1. リストの最大値と最小値の差を返す関数
2. 文字列を逆順にする関数
3. 数値のリストの中央値を返す関数
作成したモジュールをインポートして使ってみましょう。
`,
  },
];
