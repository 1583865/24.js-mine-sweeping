//开始游戏  动态生成小格100个
//leftclick没有类显示数字（周围8个格的雷数） 扩散（当前周围8个以0扩散） 有雷结束
//rightclick 有标记取消 没标记进行标记没有数字  标记是否正确 10都正确标记提示成功  出现数字无效果


var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var minesNum;
var mineOver;
var block;
var mineMap = [];
//枷锁 点击两次后还添加
var starGameBool = true;



bindEvent();
function bindEvent() {
    startBtn.onclick = function() {
        //加锁
        if(starGameBool) {
        box.style.display = 'block';
        flagBox.style.display = 'block';
        init();
            starGameBool = false;
        }
    }
    //鼠标右键问题
    box.oncontextmenu = function() {
        return false
    }
//    点击事件
    box.onmousedown = function (e) {
        var event = e.target;
        if (e.which == 1) {
            leftClick(event);

        }else if(e.which == 3) {
            rightClick(event);
        }
    }
    //叉号事件
    closeBtn.onclick = function() {
        //棋盘消失
       alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        //棋盘至空
        box.innerHTML = '';
        //解锁
        starGameBool = true;

    }
}



//生成100个小格
function init() {
     minesNum = 10;
     mineOver = 10;
    score.innerHTML = mineOver;
     for(var i = 0; i < 10; i++) {
         for (var j = 0;j < 10; j++) {
             var con = document.createElement('div');
             con.classList.add('block');
             con.setAttribute('id', i + '-' + j);
             box.appendChild(con);
             mineMap.push({mine:0});
         }
     }
//     生成雷数
    block = document.getElementsByClassName('block');
     while (minesNum) {
    var mineIndex = Math.floor(Math.random()*100);
    if(mineMap[mineIndex].mine === 0) {
        mineMap[mineIndex].mine = 1;
        block[mineIndex].classList.add('isLei');
        minesNum --;

    }

     }
}





//鼠标左击时 leftclick
function leftClick(dom) {
    //被插旗 不能左击
    if(dom.classList.contains('flag')) {
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    //失败时
    if(dom && dom.classList.contains('isLei')){
        console.log('gameOver');
        //游戏失败时显示所有雷 显示失败图片
        for(var i = 0; i < isLei.length; i++) {
            isLei[i].classList.add('show');
        }
    //    弹窗 失败提示
        setTimeout(function(){
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("img/shib.jpg")';
        },800)

    //遍历 数字时
    }else {
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');
        //两个for循环 获取周围8个  显示数字
        for (var i = posX-1; i <= posX+1;i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox =  document.getElementById(i + '-'  + j);
                //获取雷数 增加1
                if (aroundBox && aroundBox.classList.contains('isLei')){
                    n++;
                }
            }
        }
    //    dom存在  使用递归
        dom && (dom.innerHTML  = n);
    //    扩散情况
    //    为0  扩散
        if ( n == 0) {
            for (var i = posX-1; i <= posX+1;i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                //    小格子
                var nearBox =  document.getElementById(i + '-'  + j);
                //不为0
                if(nearBox && nearBox.length !=0) {
                    //标记
                    if(!nearBox.classList.contains('check')){
                        nearBox.classList.add('check');
                        leftClick(nearBox);
                    }
                }
                }
            }
        }
    }
}




//鼠标右点击
function rightClick(dom){
//    插旗
    if(dom.classList.contains('num')) {
        return;
    }
    //鼠标右击插旗 再右击取消
    dom.classList.toggle('flag');
    //插旗成功 --
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
        mineOver --;
    }
    // 否则 ++
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        mineOver ++;
    }
    //剩余雷数改变
    score.innerHTML = mineOver;
    //成功后弹出框
    if(mineOver == 0) {
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("img/shenli.gif")';
    }

}
