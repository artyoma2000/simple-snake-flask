from flask import Flask, render_template, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
Base = declarative_base()
engine = create_engine('sqlite:///snake_game.db', echo=False)


# Создание таблицы для хранения результатов игры
class SnakeScores(Base):
    __tablename__ = 'snake_scores'

    id = Column(Integer, primary_key=True, autoincrement=True)
    player_name = Column(String, nullable=False)
    score = Column(Integer, nullable=False)


Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/save_score", methods=["POST"])
def save_score():
    if request.is_json:
        data = request.get_json()
        player_name = data.get("player_name")
        score = data.get("score")

        if player_name is not None and score is not None:
            # Сохранение результата игры в базу данных
            session = Session()
            new_score = SnakeScores(player_name=player_name, score=score)
            session.add(new_score)
            session.commit()
            session.close()

            return "Score saved successfully!"

    return "Invalid request data!", 400


@app.route("/leaderboard")
def leaderboard():
    session = Session()
    rows = session.query(SnakeScores.player_name, SnakeScores.score).order_by(SnakeScores.score.desc()).limit(5).all()
    session.close()
    leaderboard_data = [{"player_name": row[0], "score": row[1]} for row in rows]
    return jsonify(leaderboard_data)


if __name__ == "__main__":
    app.run(debug=True)
