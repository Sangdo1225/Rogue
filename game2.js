import chalk from 'chalk';
import readlineSync from 'readline-sync';
//chcp 65001

class Player {
  constructor(name) {
    this.name = name;
    this.hp = 100;
    this.maxHp = 100;
    this.attackPower = 20;
    this.level = 1;
    this.exp = 0;
    this.expToNextLevel = 100;
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * this.attackPower) + 15;
    monster.hp -= damage;
    return damage;
  }

  heal() {
    const healAmount = 50;
    this.hp = Math.min(this.hp + healAmount, this.maxHp);
    return healAmount;
  }

  levelUp() {
    this.level += 1;
    this.maxHp += 40;
    this.attackPower += 10;
    this.hp = this.maxHp;
    this.exp = 0;
    this.expToNextLevel += 50;
  }

  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.expToNextLevel) {
      this.levelUp();
      console.log(chalk.yellowBright(`${this.name} 레벨업! 레벨 ${this.level}이(가) 되었습니다!`));
    }
  }
}

class Monster {
  constructor(name, stage) {
    this.name = name;
    this.hp = 50 + stage * 10;
    this.attackPower = 15 + stage;
  }

  attack(player) {
    const damage = Math.floor(Math.random() * this.attackPower) + 3;
    player.hp -= damage;
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`));
  console.log(
    chalk.blueBright(`| 플레이어 정보: ${player.name} | 레벨: ${player.level} | HP: ${player.hp}/${player.maxHp} | 공격력: ${player.attackPower} | EXP: ${player.exp}/${player.expToNextLevel} |`));
  console.log(
    chalk.redBright(`| 몬스터 정보: ${monster.name} | HP: ${monster.hp} | 공격력: ${monster.attackPower} |`));

  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === '1') {
      const playerDamage = player.attack(monster);
      logs.push(chalk.green(`플레이어가 ${playerDamage}의 데미지를 입혔습니다.`));

      if (monster.hp > 0) {
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 ${monsterDamage}의 데미지를 입혔습니다.`));
      } else {
        logs.push(chalk.blue(`몬스터를 처치했습니다!`));
        player.gainExp(50); // 경험치 획득
      }
    } else {
      logs.push(chalk.yellow(`아무것도 하지 않았습니다.`));
      const monsterDamage = monster.attack(player);
      logs.push(chalk.red(`몬스터가 ${monsterDamage}의 데미지를 입혔습니다.`));
    }

    if (player.hp <= 0) {
      console.log(chalk.redBright(`플레이어가 사망했습니다...`));
      break;
    }
    if (monster.hp <= 0) {
      console.log(chalk.blueBright(`스테이지 ${stage} 클리어!`));
      break;
    }
  }

  if (player.hp > 0) {
    const healAmount = player.heal();
    console.log(chalk.greenBright(`스테이지 ${stage} 클리어! 체력이 ${healAmount}만큼 회복되었습니다.`));
  }
};

export async function startGame() {
  console.clear();
  const playerName = readlineSync.question('플레이어 이름을 입력하세요: ');
  const player = new Player(playerName);

  let stage = 1;
  const monsterNames = ['슬라임', '고블린', '트롤', '오우거', '드래곤'];

  while (stage <= 10) {
    const monsterName = monsterNames[Math.floor(Math.random() * monsterNames.length)];
    const monster = new Monster(monsterName, stage);

    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.redBright('게임 오버!'));
      break;
    }

    stage++;
  }

  if (player.hp > 0) {
    console.log(chalk.greenBright('축하합니다! 모든 스테이지를 클리어했습니다!'));
  }
}
