document.addEventListener('DOMContentLoaded', function() {
    var leaderboardList = document.getElementById('leaderboardList');

    function updateLeaderboard() {
        fetch('/leaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardList.innerHTML = ''; // Очищаем текущий список
                data.forEach(function(player, index) {
                    if (index < 5) { // Отображаем только первые 5 игроков
                        var listItem = document.createElement('li');
                        listItem.textContent = `${player.player_name}: ${player.score}`;
                        leaderboardList.appendChild(listItem);
                    }
                });
            });
    }

    // обновление рейтинга при загрузке страницы и после каждой игры
    updateLeaderboard();
});
