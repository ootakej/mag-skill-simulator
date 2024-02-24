var password_update = true;
observe(window, "load", onLoad, false);
function observe(element, name, observer, useCapture)
{
	if (element.attachEvent) {
		element.attachEvent("on" + name, observer);
	} else if (element.addEventListener) {
		element.addEventListener(name, observer, useCapture);
	}
}

function onLoad() {
	getSkillFromFragment();
	var i, p = document.getElementById('tableBox').getElementsByTagName('TABLE');
	for (i = 0; i < p.length; i++) {
//		check( p[i] );
	}
}

function LvCheck(evt) {
	var t = evt.target || evt.srcElement;
	if (t.nodeName != 'INPUT' || t.type != 'checkbox') {
		return;
	}
	var p = t.parentNode;
	while (p.nodeName != 'TABLE') {
		p = p.parentNode;
	}
	check(p,t.name,t.checked);
	ttlValue();
}

function getSkillFromFragment()
{
	var fragment = location.hash;
	if (fragment.charAt(0) == "#") {
		fragment = fragment.substr(1);
	}
	if (fragment) {
		document.skillForm.password.value = fragment;
		accept_password();
	}
}

function check(p, evtn, evtd) {
	var i = 0, j = 0, k = 0, maxv = 0;
	var chval = 0,chbox = 0;

	e = p.getElementsByTagName('INPUT');

	str = ""

	while (str[2] != "end") {
		str = e[k].name.split("-");
		if (str[0] == "1" && e[k].checked == true) maxv = parseInt(str[1]);
		if (str[0] == "1" && e[k].checked == false && evtd == false) break;
		k = k + 1;
	}
	
	if (evtn != null && evtn != undefined) {
		str = evtn.split("-");
		chval = parseInt(str[1]);
		chbox = str[0];
	}
	
	str = ""
	
	while (str[2] != "end") {
		str = e[i].name.split("-");
		if (evtd == true && str[0] == chbox && str[2] == 1) {
			maxv = parseInt(str[1]) - 1;
		}
		i = i + 1;
	}
	
	str = ""
	
	while (j < i) {
		str = e[j].name.split("-");
		if (str[0]!= 1){
			if (evtd == true) {
				if (str[0] == chbox && parseInt(str[1]) < chval) e[j].checked = true;
			}
			else 
				if (evtd == false) {
					if (str[2] != 1) {
						if (e[j - 1].checked == false) {
							e[j].checked = false;
						}
					}
					else 
						if (str[2] == 1) {
							if (parseInt(str[1]) > maxv +1 ) {
								e[j].checked = false;
							}
						}
				}
		}
		if (str[0] == 1){
			if (str[2] != "start") {
				if (evtd == true) {
					if ( parseInt(str[1]) <= maxv ) {
						e[j].checked = true;
					}
				} else {
					if (e[j - 1].checked == false) {
						e[j].checked = false;
					}
				}
			} else {
				if (evtd == true) {
					if (parseInt(str[1]) <= maxv) {
						e[j].checked = true;
					}
				}
			}
		}
		j = j + 1;
	}
	view_password();
}

// 項目の合計を計算
function ttlValue() {
	chn = 159; // チェックボックスの総数
	ttl = 0;
	
	//兵種判別のために追加 ( 2 line)
	var checkval = 1;   //チェックボックス計数用定数(int)
        var classval   = "z"; //クラス判別値(string) nullを避けるため初期値はダミー値

	ttl += eval(document.skillForm.ch2.value);
	// チェックボックス
	for(i = 0; i<chn; i++) {
		if(document.skillForm.elements[i].checked) {

	//兵種判別のために追加・修正( 3 line)
	//		ttl -= eval(document.skillForm.elements[i].value);
			ttl -= checkval

			//スキルに設定された兵種を文字列として連結する
			classval += document.skillForm.elements[i].value
		}
		if(document.skillForm.elements[i].type == "button") chn = chn + 1
	}
	document.skillForm.result.value = ttl;
//	alert(classval); //文字列確認デバッグ用
	CheckClass(classval);
}

// 一括set
function allset(type) {
// startele:159個のチェックボックスの内、セットしたいチェックボックスたちのスタート地点
// eleparts:チェックボックスが"支流1-本流-支流2"で何個ずつあるか.
	var  startele = 0, eleparts = "";
	switch (type) {
		case 0: // Type Assault
			startele = 1, eleparts = "6-6-6";
			break;
		case 1: // Marksman
			startele = 20, eleparts = "6-6-6";
			break;
		case 2: // Close Quarters
			startele = 39, eleparts = "6-6-6";
			break;
		case 3: // Special Ops
			startele = 58, eleparts = "6-6-6";
			break;
		case 4: // Medical
			startele = 77, eleparts = "6-6-6";
			break;
		case 5: // Engeneering
			startele = 96, eleparts = "3-6-6";
			break;
		case 6: // Athleticism
			startele = 112, eleparts = "6-6-6";
			break;
		case 7: // Vehicles
			startele = 131, eleparts = "6-6-6";
			break;
		case 8: // Resistances
			startele = 150, eleparts = "6-6-6";
			break;
		case 9: // 一括リセット
			chbox = 159
			for (k = 0; k < chbox; k++) {
				document.skillForm.elements[k].checked = false
				if (document.skillForm.elements[k].type == "button") 
					chbox = chbox + 1;
			}
			ttlValue();
			view_password();
			return;
		default:
			alert("All set CheckBox Error!");
			break;
	}

	// 支流1、本流、支流2のチェックボックスの数
	branch1 = parseInt(eleparts.split("-")[0])
	main    = parseInt(eleparts.split("-")[1])
	branch2 = parseInt(eleparts.split("-")[2])

	// デバッグ用
	// alert(startele + branch1 + main);
	// 本流を全部クリックしてから、支流1→支流2の順にクリックしていく
	// 	for(v = startele+branch1;      v<startele+branch1+main;         v++) {document.skillForm.elements[v].click()}
	// 	for(v = startele;              v<startele+branch1;              v++) {document.skillForm.elements[v].click()}
	// 	for(v = startele+branch1+main; v<startele+branch1+main+branch2; v++) {document.skillForm.elements[v].click()}

	password_update = false;
	var skill = document.skillForm.elements;
	if (skill[startele + branch1].checked) {
		// どこかにチェックがあれば根元は必ずチェックが入っているはずなので根元をクリック
		skill[startele + branch1].click();
	} else {
		skill[startele + main + branch1 - 1].click();
		skill[startele + branch1 - 1].click();
		skill[startele + main + branch1 + branch2 - 1].click();
		if (branch1 >= 6) skill[startele + branch1 - 4].click()
		if (branch2 >= 6) skill[startele + main + branch1 + branch2 - 4].click()
	}
	password_update = true;
	view_password();
}

// パスワード表示
function view_password() {
	if (!password_update) return;
	var ele = 0, allele = 0, num = 0, tmppass1 = "", tmppass2 = "";
	// checkboxの数(159)＋buttonの数(9)
	allele = 159+9
	// checkboxがチェックされているかどうかを1/0で情報入手していく
	for (ele = 0; ele < allele; ele++) {
		if (document.skillForm.elements[ele].type == "checkbox") {
			if (document.skillForm.elements[ele].checked){
				tmppass1 = tmppass1 + "1"
			}else{
				tmppass1 = tmppass1 + "0"
			}
		}
	}
	// 159桁は扱いづらいので末尾に"0"をつけて160桁にする
	tmppass1 = tmppass1 + "0"
	// 1010101...を4桁ずつ16進数に変換
	for (ele = 0; ele < 159; ele = ele+4) {
		tmppass2 = tmppass2+parseInt(tmppass1.substring(ele,ele+4),2).toString(16)
	}
	document.skillForm.password.value = tmppass2
	location.hash = tmppass2;
}

// パスワード反映
function accept_password(){
	var ele = 0, allele = 0, num = 0, tmppass1 = "", tmppass2 = "";
	tmppass2 = document.skillForm.password.value
	// 160桁を4桁ずつ、40回繰り返して変換
	// ffcc...->1111111111001100...みたいに
	for (ele = 0; ele < 40; ele++) {
		switch (parseInt(tmppass2.charAt(ele), 16).toString(2).length) {
			case 1: // 1桁なので3桁補う
				tmppass1 = tmppass1 + "000" + parseInt(tmppass2.charAt(ele), 16).toString(2)
				break;
			case 2: // 2桁なので2桁補う
				tmppass1 = tmppass1 + "00" + parseInt(tmppass2.charAt(ele), 16).toString(2)
				break;
			case 3: // 3桁なので1桁補う
				tmppass1 = tmppass1 + "0" + parseInt(tmppass2.charAt(ele), 16).toString(2)
				break;
			case 4: // 4桁なのでそのまま
				tmppass1 = tmppass1 + parseInt(tmppass2.charAt(ele), 16).toString(2)
				break;
			default: // それ以外
				alert("Password Read Error!")
				break;
		}
	}
	// checkboxの数(159)＋buttonの数(9)Loop
	// 最初のcheckboxはelements[1]
	ele = 1
	num = 0
	allele = 159 + 9 + 1
	for (ele = 1; ele < allele; ele++) {
		// tmppass1の該当の桁が"1"ならチェックを入れる
		// "0"ならチェックを外す
		if (document.skillForm.elements[ele].type == "checkbox") {
			if (tmppass1.charAt(num) == "1") {
				document.skillForm.elements[ele].checked = true
			}
			else {
				document.skillForm.elements[ele].checked = false
			}
			num++
		}
	}
	ttlValue();
	view_password();
}

//兵種判別、兵種ポイント表示
function CheckClass(classtype){

        //選択したスキルに設定された兵種の数を計数し格納
	//a:緊急兵、b:突撃兵　c:狙撃兵　d:支援兵　e:特殊兵

	var arrClass = new Array(5);
        arrClass[0] = classtype.split('a').length - 1;
        arrClass[1] = classtype.split('b').length - 1;
        arrClass[2] = classtype.split('c').length - 1;
        arrClass[3] = classtype.split('d').length - 1;
        arrClass[4] = classtype.split('e').length - 1;

	//各兵種ごとのポイントを表示
	document.skillForm.classa.value = arrClass[0];
	document.skillForm.classb.value = arrClass[1];
	document.skillForm.classc.value = arrClass[2];
	document.skillForm.classd.value = arrClass[3];
	document.skillForm.classe.value = arrClass[4];


        //選択したスキルのうち、もっとも選択数の多い兵種が設定されると仮定する。
	//ゲームの仕様にしたがって、兵種の優先順の入替や、判定方法の見直しが必要(要情報)

	var isMSIE = /*@cc_on!@*/false; 	//IE対応
	if (isMSIE) { 
		n = arrClass[0];
		c = 0;
		for (i=1; i<arrClass.length; i++) {
			if (arrClass[i] > n){
				c = i;
			}
		}
		ViewClass(c);
	}else{
		//配列内の最大値のインデックスを取得(テスト環境のIEでは何故か動作せず)
		ViewClass(arrClass.indexOf(Math.max.apply(null,arrClass)));
	}
}

//兵種名表示
function ViewClass(classtype){
	var classname ;
        var nameA = "緊急兵", nameB = "突撃兵",nameC = "狙撃兵", nameD = "支援兵", nameE = "特殊兵" ;
	
	switch (classtype) {
		case 0: // Rapid Assault
			classname = nameA
			break;
		case 1: // Commando
			classname = nameB
			break;
		case 2: // Sniper
			classname = nameC
			break;
		case 3: // Field Support
			classname = nameD
			break;
		case 4: // Direct Action
			classname = nameE
			break;

		default:
			classname = nameA;
			break;
		}

	document.skillForm.classname.value = classname;	//兵種表示

}