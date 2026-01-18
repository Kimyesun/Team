import random

names = ["김예선", "유태민", "박현서", "이정민", "신유빈", "송헌", "최백령", "박상진", "김민성", "정자연"]
html = ""
score = 1000

for rank in range(4, 51):
    name = names[rank % len(names)] # Rotate names deterministically for now
    score -= random.randint(5, 20)
    html += f'''
                <!-- {rank}등 -->
                <div class="ranking-list-item">
                    <div class="r-left"><span class="r-rank">{rank}</span> <span class="r-name">{name}</span></div>
                    <div class="r-right"><span class="r-label">점수</span> <span class="r-score">{score:,}</span></div>
                </div>'''

print(html)