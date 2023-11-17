'use strict';

var clickCount=0;

const baolaName = "dark";

const switcher  = document.getElementById('generatebtn');
const testMove  = document.getElementById('move1btn');

var unitData=[];
var ruleInfo=[,];

var mapData = [,];
var mapRowNum=0;	//vertical
var mapColNum=0;	//horizotal
var mapUnitSize=40;

let sourceContainerId = '';
let dragTargetClass ='';

//======after load html
loadMapList();






// List<UnitClass> unitData = new List<UnitClass>();
// UnitClass controlUnit = new UnitClass();    //mouseControlUnit
// int[,] ruleInfo = new int[30, 4];    //0~23,beforeX,Y, afterX,Y
// public int colNum = 15;     //mapColNum
// public int rowNum = 0;     //mapRowNum

class UnitClass
{
	constructor(name,x,y,fly,enemy,career,picName) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.fly = fly;
		this.enemyType = enemy;
		this.career = career;
		this.historyX=[];
		this.historyY=[];
		this.historyIndex=0;
		this.pictureID="";
		this.picName=picName;		
	}
}


//-----------------------GUI control 

//----------------------- for drag-------------------------------//

function cancelDefault (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

function dragStart (e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  sourceContainerId = this.parentElement.id;
  console.log('sourceContainerId', sourceContainerId);
};

function dragEnd (e) {
  this.classList.remove('dragging');
};

function dropped (e) {
  console.log('dropped');
  cancelDefault(e);
  let targetID = e.dataTransfer.getData('text/plain');
  var chess     = document.getElementById(targetID);
  
  //getChess
  
  console.log('the board id is'+e.target.id);
  let boardData = e.target.id.split("_");
 // console.log(boardData);
  var newX = parseInt(boardData[1].replace("x",""));
  var newY = parseInt(boardData[2].replace("y",""));
  
  var unitTmp;
  for(var i=0;i<unitData.length;i++)
  {
	  if(("chess_"+unitData[i].name)==chess.id)
		unitTmp=unitData[i];
  }
  if(checkUnitLocation(unitTmp,newX,newY))
  {  
	e.target.appendChild(chess);
    unitTmp.historyX[unitTmp.historyIndex]=unitTmp.x;
    unitTmp.historyY[unitTmp.historyIndex]=unitTmp.y;
    unitTmp.historyIndex++;
    unitTmp.x = newX;
    unitTmp.y = newY;
  }
  
  sourceContainerId='';
};
function dragOver (e) {
	e.preventDefault();
};


testMove.addEventListener('click', function() {
	calPull();
});

document.getElementById('cancelbtn').addEventListener('click', function() {
	cancelPull();
});

document.getElementById('previousbtn').addEventListener('click', function() {
	previousAction();
});

switcher.addEventListener('click', function() {
	
    // document.body.classList.toggle('light-theme');
    // document.body.classList.toggle('dark-theme');
	
    // const className = document.body.className;
    // if(className == "light-theme") {
        // this.textContent = "Dark";
    // } else {
        // this.textContent = "Light";
    // }

	
	// var input = document.getElementById("searchTxt");
	// console.log(input.value);
	
	// for(var i=0;i<11;i++)
	// {
		// var str = document.createElement("em"); //新增 em 標籤
// //		str.textContent = "A";	
		// str.setAttribute("data-X",i);
		// str.setAttribute("data-Y","0");		
		// document.querySelector(".mapData").appendChild(str);
	// }
	loadMapData();
	loadUnitData();
	loadRuleData();
	
	//printCurrentMapData(mapData);
	
	//create chess
	
	//set mapContainer Width and height
	var mapContainer = document.querySelector(".mapData");
	

    var child = mapContainer.lastElementChild;  
    while (child) { 
            mapContainer.removeChild(child); 
            child = mapContainer.lastElementChild; 
    }	
	
	mapContainer.style.width=mapUnitSize*(mapColNum+10)+mapUnitSize/2+"px";
	var count=0;
	//create element
	for(var i=0;i<mapRowNum;i++)
	{
		for(var j=0;j<mapColNum;j++)
		{
			var chessTmp = document.createElement("mapUnit"); //新增 em 標籤
			
			chessTmp.setAttribute("data-X",i);
			chessTmp.setAttribute("data-Y",j);
			chessTmp.setAttribute("id","chess_x"+i+"_y"+j);
			
			if(mapData[i][j]==0)
			{
				chessTmp.className="white";
			}			
			if(mapData[i][j]==3)
			{
				chessTmp.className="gray";
			}
			if(mapData[i][j]==4)
			{
				chessTmp.className="black";
			}
			
		    document.querySelector(".mapData").appendChild(chessTmp);
			
			
			//added dragEvent

			chessTmp.addEventListener('drop', dropped)
		    chessTmp.addEventListener("dragover", dragOver);
			
		}
		var rowTmp = document.createElement("mapRow"); //
		document.querySelector(".mapData").appendChild(rowTmp);
			
	}
	
	for(var i=0;i<unitData.length;i++)
	{
		var chessTmp2 = document.createElement("img"); //新增 em 標籤
		chessTmp2.className="unitChess";
		chessTmp2.setAttribute("id","chess_"+unitData[i].name);
		//chessTmp2.setAttribute("src","../img/"+unitData[i].picName+".jpg");
		chessTmp2.setAttribute("src","https://raw.githubusercontent.com/alanyang5125/test/main/img/"+unitData[i].picName+".jpg");
		chessTmp2.addEventListener('dragstart', dragStart);
		
		unitData[i].pictureID="chess_"+unitData[i].name;
		
		var boardTmp  = document.getElementById('chess_x'+unitData[i].x+'_y'+unitData[i].y);
		console.log("boardTmp:"+'chess_x'+unitData[i].x+'_y'+unitData[i].y);
		boardTmp.appendChild(chessTmp2);
	}	
	console.log("count:"+count);

});
function printCurrentMapData(mapDataTmp)
{
	console.log("printMapData");
	for(var i=0;i<mapRowNum;i++)
	{	
		var t="";
		for(var j=0;j<mapColNum;j++)
		{
			t=t+mapDataTmp[i][j]+',';	
		}
		console.log(t);
	}
}
function loadmapDataToBoard(mapDataTmp)
{
	for(var i=0;i<mapRowNum;i++)
	{	
		for(var j=0;j<mapColNum;j++)
		{
			if(mapDataTmp[i][j]>=10)
			{
				var chessIndex=mapDataTmp[i][j]-10;
				//console.log(chessIndex);
				var chessTmp     = document.getElementById("chess_"+unitData[chessIndex].name);
				var targetBoard  = document.getElementById('chess_x'+i+'_y'+j);
				targetBoard.appendChild(chessTmp);
				//unitData[x];
			}	
		}
	}
	
	
	
	
}

function previousAction()
{
	var mapDataTmp=[,];
	
	//Create temp Map
	for(var x=0;x<mapRowNum;x++)
	{
		mapDataTmp[x]=[];
		for(var y=0;y<mapColNum;y++)
		{
			mapDataTmp[x][y]=mapData[x][y];
		}		
	}	
	//Find baloa location and load unit
	for(var i=0;i<unitData.length;i++)
	{
		if(unitData[i].historyIndex>0)
		{
			unitData[i].x=unitData[i].historyX[historyIndex-1];
			unitData[i].y=unitData[i].historyY[historyIndex-1];
			historyIndex--;
		}
		mapDataTmp[unitData[i].x][unitData[i].y]=10+i;
	}
	loadmapDataToBoard(mapDataTmp);
}



//======================alg=====================================
function calPull()
{
	console.log("call pull");
	//load unit to mapData
	var unitTarget;
	var mapDataTmp=[,];
	
	
	//Create temp Map
	for(var x=0;x<mapRowNum;x++)
	{
		mapDataTmp[x]=[];
		for(var y=0;y<mapColNum;y++)
		{
			mapDataTmp[x][y]=mapData[x][y];
		}		
	}	
	//Find baloa location and load unit
	for(var i=0;i<unitData.length;i++)
	{
		 mapDataTmp[unitData[i].x][unitData[i].y]=10+i;
		 if(unitData[i].picName==baolaName)
         {
			 unitTarget=unitData[i];
			 //break;
		 }
	}
	//printCurrentMapData(mapDataTmp)
	var tttt = makePull(unitTarget,unitTarget.x,unitTarget.y,mapDataTmp);
	loadmapDataToBoard(mapDataTmp);
	// console.log(mapDataTmp);
}

function cancelPull()
{
	//load unit to mapData
	var unitTarget;
	var mapDataTmp=[,];
	
	//Create temp Map
	for(var x=0;x<mapRowNum;x++)
	{
		mapDataTmp[x]=[];
		for(var y=0;y<mapColNum;y++)
		{
			mapDataTmp[x][y]=mapData[x][y];
		}		
	}	
	//Find baloa location and load unit
	for(var i=0;i<unitData.length;i++)
	{
		 console.log(10+i);
		 mapDataTmp[unitData[i].x][unitData[i].y]=10+i;
	}
	loadmapDataToBoard(mapDataTmp);
}



function makePull(target,targetX,targetY,mapDataTmp)
{
	var hitIndex=[];	//count the pull result
	var hitCount=0;
	
	var targetIndex=-1;
	
	
	//console.log(target);
	
	
	for(var i=0;i<unitData.length;i++)
	{
		 if(unitData[i].name==target.name)
         {
			 targetIndex=i;
			 break;
		 }
	}
    //changeTargetLocation

	mapDataTmp[target.x][target.y] = mapData[target.x][target.x];	
	mapDataTmp[targetX][targetY] = 10 + targetIndex;	
	//printCurrentMapData(mapDataTmp);
	//printCurrentMapData(mapDataTmp)
	//console.log(ruleInfo);
	
    for (var i = 1; i < 25; i++)    //24hit
    {
		var tmpX = targetX + (ruleInfo[i][0] - 2);
		var tmpY = targetY + (ruleInfo[i][1] - 2);
        if (tmpX >= 0 && tmpX < mapRowNum && tmpY >= 0 && tmpY < mapColNum)
        {
            for (var j = 0; j < unitData.length; j++)
            {
                if (tmpX == unitData[j].x && tmpY == unitData[j].y && unitData[j].enemyType == 1)
                {
					hitIndex[hitCount]=j;
					mapDataTmp[tmpX][tmpY] = mapData[tmpX][tmpY];    //returnToMapDefault;
					hitCount++;
                }
            }
        }
    }
	console.log(hitIndex);
    var ruleAfterIndex = 1;
	
	for(var i=0;i<=25;i++)
	{
		ruleInfo[i][5]=1;
	}
	
    for (var i = 0; i < hitIndex.length; i++)
    {
        while (true)
        {
            var tmpX = targetX + (ruleInfo[ruleAfterIndex][2] - 2);
			var tmpY = targetY + (ruleInfo[ruleAfterIndex][3] - 2);
            if (tmpX >= 0 && tmpX < mapRowNum && tmpY >= 0 && tmpY < mapColNum)
            {
                if (mapDataTmp[tmpX][tmpY] == 0 && ruleInfo[ruleAfterIndex][5]==1)	//anyUnit
                {
                    mapDataTmp[tmpX][tmpY] = (10 + hitIndex[i]);
					ruleInfo[ruleAfterIndex][5]==0;
					ruleAfterIndex=1;					
                    break;
                }
				if(mapDataTmp[tmpX][tmpY] == 3 && unitData[hitIndex[i]].fly==1 && ruleInfo[ruleAfterIndex][5]==1)	//fly unit
				{
                    mapDataTmp[tmpX][tmpY] = (10 + hitIndex[i]);
					ruleInfo[ruleAfterIndex][5]==0;
					ruleAfterIndex=1;
                    break;					
				}
            }
            ruleAfterIndex++;
        }
    }
    return hitIndex;
}





//other function
function checkUnitLocation(target,newX,newY)
{
	if (mapData[newX][newY] == 4)
        return false;
	if (mapData[newX][newY] == 3 && target.fly==0)
        return false;
    for (var i = 0; i < unitData.length-1; i++)
    {
        if (newX == unitData[i].x && newY == unitData[i].y)
            return false;
    }
    return true;
}










//---------------load map&unit&rule data
function loadMapList()
{
	
	
	var result = null;
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "https://raw.githubusercontent.com/alanyang5125/test/main/mapList.txt", false);
		xmlhttp.send();
	if (xmlhttp.status==200) {
		result = xmlhttp.responseText;
	 }
	console.log(result);
  //return result;
  
  
	var mapListContent=loadFile("mapList.txt");	
	let dataArr = mapListContent.split("\n");
	for(var i=0;i<dataArr.length;i++)
	{
		var opt = document.createElement("option");
		opt.value=dataArr[i];
		opt.text =dataArr[i];
		document.getElementById("mapList").options.add(opt); 
	}
}
function loadMapData()
{
	
	var e = document.getElementById("mapList");
	var mapSelect = e.options[e.selectedIndex].value;
	
	
	var mapContent=loadFile("/mapData/"+mapSelect+".txt");	
	
	let mapArr = mapContent.split("\n");
	
	mapColNum=0;
	mapRowNum=0;
	mapData = [,];
	for(var i=0;i<mapArr.length;i++)
	{
		if(mapArr[i].length>5)
		{
			mapData[i] = [];
			mapColNum=mapArr[i].length;	
			var t="";
			for(var j=0;j<mapColNum;j++)
			{
			    mapData[i][j]=mapArr[i].substr(j,1);
				t=t+mapArr[i].substr(j,1);
			}
			//console.log(t);
			mapRowNum++;
		}
	}
}

function loadUnitData()
{
	
	var e = document.getElementById("mapList");
	var mapSelect = e.options[e.selectedIndex].value;	
	
	var unitContent=loadFile("/UnitData/"+mapSelect+"進場.txt");	
	let unitArr = unitContent.split("\n");
	
	var count=0;
	for(var i=0;i<unitArr.length;i++)
	{
		if(unitArr[i].length>3)
		{
			let data=unitArr[i].split(",");
			console.log("data0:"+data[6]);
			let unitTmp=new UnitClass(data[0],parseInt(data[1]),parseInt(data[2]),data[3],data[4],data[5],data[6]);
			unitData[count]=unitTmp;
			count++;
		}
	}
	
	
}
function loadRuleData()
{
	var ruleContent=loadFile("PullRule.txt");	
	let ruleArr = ruleContent.split("\n");	
	var count=0;
	var pullbefore= false;
	var pullafter = false;
	var rowTmp = 0;
	var pullIndex = 0;
	
	for(var i=0;i<30;i++)
	{
		ruleInfo[i]=[];
	}
	
	
	for(var i=0;i<ruleArr.length;i++)
	{
		//console.log(ruleArr[i]);
		if (pullbefore || pullafter)
		{
			let data=ruleArr[i].split(",");
			if (data.length > 3)
			{	
				//console.log('b');
                for (var j = 0; j < data.length; j++)
                {
					var rowIndex = parseInt(data[j]);
				    ruleInfo[rowIndex][0 + pullIndex] = rowTmp;
				    ruleInfo[rowIndex][1 + pullIndex] = j;
					//console.log(ruleInfo[rowIndex][0 + pullIndex]);
				
                }
			
				rowTmp++;
			}
		}
		if (ruleArr[i].includes("//before"))
			pullbefore = true;
		if (ruleArr[i].includes("//after"))
		{
			pullIndex = 2;
			pullafter = true;
			pullbefore = false;
			rowTmp = 0;
		}
	}	
	//console.log(ruleInfo);
}
function loadFile(filePath) {

  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "https://raw.githubusercontent.com/alanyang5125/test/main/"+filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;

}