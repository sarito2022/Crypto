$('#home').click(function(e) {
	$('.container').show();
	$('.containerSearch').hide();
	$('.containerReport').hide();
	$('.containerAbout').hide();
})

$('.liveReports').on('click',()=>{
    $('.containerReport').css('display','block');
    $('.container').css('display','none');
    $('.containerAbout').css('display','none');
})

$('.about').on('click', function(){
    $('.containerAbout').css('display','block');
    $('.container').css('display','none');
    $('.containerReport').css('display','none');
})

let coins=[];
let coin={};
let checkArray=[];

document.addEventListener('DOMContentLoaded',async()=>{

    coins=await fetch('https://api.coingecko.com/api/v3/coins');
    coins=await coins.json();
    console.log(coins);

    coinsFirst100=coins.slice(0,100);
    console.log(coinsFirst100);
    coins= coinsFirst100;
    console.log(coins);

    for(const coin of coins){
        $('.container').append(`                   
            <div id="${coin.id}" class="card card2 myCard">
                <div class="card-body ">
                    <h5 class="card-title">${coin.symbol}</h5>
                    <p class="card-text">${coin.name}</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-valuenow="70"
                        aria-valuemin="0" aria-valuemax="100" style="width:70%">
                        <span class="sr-only"></span>
                        </div>
                        </div>
                    <div class="info"></div>
                    <button type="button" class="btn btn-primary btnTezuga">More Info</button>
                    <div class="form-check form-switch switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="${coin.symbol}">
                        <label class="form-check-label" for="${coin.symbol}"></label>
                    </div>
                </div>
            </div>`)
    }

    let arrayTime=[];
    let arrayInfo=[];
    $('.btnTezuga').on('click', async(e)=>{
        checkTimeCoin(e);
    });

    function checkTimeCoin(e){
        let div_card=e.target.closest('.card');
        let c= div_card.getElementsByClassName('info')[0];

        if(c.style.display=='none' || c.style.display=='') {
			let current_coin_time='';
			for (let i in arrayTime) {
				if(arrayTime[i]['name']==div_card.id) {
					current_coin_time=arrayTime[i]['time'];
				} 
			}
		
            if(current_coin_time==''){
                infoSpecifiCoin(div_card);
            }else{
                if((new Date().getMinutes()-current_coin_time)>2){
                    infoSpecifiCoin(div_card);
                }else{
                    $(c).html('');
                    $(c).append(`
                        <img src="${arrayInfo[div_card.id].img}" class="myImg"><br>
                        USD: $${arrayInfo[div_card.id].usd}<br>
                        EUR: &#x20AC${arrayInfo[div_card.id].eur}<br>
                        ILS: ₪${arrayInfo[div_card.id].ils}<br>
                    `);
                    $(c).show();
                }
            }
        } else{
            $(c).hide();
        }
    }

    async function infoSpecifiCoin(div_card){

        let progressBar=div_card.getElementsByClassName('progress')[0];
        $(progressBar).show();
        let value=div_card.id;
        let coin=await fetch(`https://api.coingecko.com/api/v3/coins/${value}`);
        coin=await coin.json();
        console.log(coin);

		let obj={};
		
		for(let i in arrayTime) {
			if (arrayTime[i]['name']==div_card.id) {
				arrayTime.splice(i, 1);
			}
		}
		
		obj.name = div_card.id;
		obj.time = new Date().getMinutes();
		arrayTime.push(obj);

        arrayInfo[div_card.id]={
            img: coin.image.thumb,
            usd: coin.market_data.current_price.usd,
            ils: coin.market_data.current_price.ils,
            eur: coin.market_data.current_price.eur
        }

            let c= div_card.getElementsByClassName('info')[0];
            $(c).html('');
                    $(c).append(`
                    <img src="${arrayInfo[div_card.id].img}" class="myImg"><br>
                    USD: $${arrayInfo[div_card.id].usd}<br>
                    EUR: &#x20AC;${arrayInfo[div_card.id].eur}<br>
                    ILS: ₪${arrayInfo[div_card.id].ils}<br>`);
                
            $(progressBar).hide();
            $(c).show();
}

    let checkboxs=document.getElementsByClassName('form-check-input');
    for (const checkbox of checkboxs){       
        checkbox.addEventListener('change',function(){
			checkEvent(checkbox);
        })
    }
    
	function checkEvent(checkbox) {
		     if(checkbox.checked){
                if(checkArray.length<5){
                    checkArray.push(checkbox.id);
                    checkbox.checked=true;
                    console.log(checkArray); 
                }else{
                    checkbox.checked=false;
                }

                if(checkArray.length===5){
                    $('.modal-body').html('');
                    for(const oneCheckArray of checkArray){
                        $('.modal-body').append(`
                        <div class="warmpModal">
                            <div>${oneCheckArray}</div>       
                            <div class="form-check form-switch switch mySwitch">
                                <input class="form-check-input inputSwitchModal" type="checkbox" role="switch" id="${oneCheckArray}" checked>
                                <label class="form-check-label"></label>
                            </div>
                        </div>`);
                    }
                    $('.modal').show();
                }
            }else{  
                for(let i in checkArray){
                    if(checkArray[i]===checkbox.id){
                        checkArray.splice(i, 1); 
                        checkbox.checked=false;
                    }
                }
            }
	}
	                    
	let btnsModalSavaChanges=document.getElementsByClassName('modalSavaChanges');
	for (const btnModalSavaChanges of btnsModalSavaChanges){
		btnModalSavaChanges.addEventListener('click',function(e){                          
				
			const a = document.querySelectorAll('.modal-body input');
			const b=Array.from(a);
			const c = b.filter(result => !result.checked)
			console.log(c);

			for(const c1 of c){

				let all_coins=document.querySelectorAll('#'+c1.id);
				for (i in all_coins){
					all_coins[i].checked='';
				}
				
				for(const myCheckArray of checkArray){
					if(myCheckArray===c1.id){
						let index=checkArray.indexOf(myCheckArray);
						checkArray.splice(index, 1); 
					}
				}
				
				$('.modal-body').html('');
						$('.modal-body').append(`
						<div class="warmpModal">
							<div class="warpNameModal">${c1}</div>       
							<div class="form-check form-switch switch mySwitch">
								<input class="form-check-input inputSwitchModal" type="checkbox" role="switch" id="${c1} checked>
								<label class="form-check-label"></label>
							</div>
						</div>`);
			}   
			$('.modal').hide('');
		})
	}
	
	let btnsModalClose=document.getElementsByClassName('modalClose');
	for (const btnModalClose of btnsModalClose){
		btnModalClose.addEventListener('click',function(){
			$('.modal').hide('');
		})
	}

    $('.btnSearch').click(function(e) {
        let search=$('.search').val();
		
		if(search!=''){
			for(coin of coins){
			
				if(search.toLowerCase()===coin.symbol.toLowerCase()){
				
				let cheked_coin='';
				if (document.getElementById(search.toLowerCase()).checked){
					cheked_coin="checked='checked'";
				}	
                
					$('.container').hide();
					$('.containerSearch').html('');
					$('.containerSearch').append(`<br>                 
						<div id="${coin.id}" class="card card2 myCard">
							<div class="card-body ">
								<h5 class="card-title">${coin.symbol}</h5>
								<p class="card-text">${coin.name}</p>
								<div class="progress">
									<div class="progress-bar" role="progressbar" aria-valuenow="70"
									aria-valuemin="0" aria-valuemax="100" style="width:70%">
									<span class="sr-only"></span>
									</div>
								</div>
								<div class="info"></div>
								<button type="button" class="btn btn-primary btnTezuga">More Info</button>
								<div class="form-check form-switch switch" id="check">
								<input class="form-check-input checkSearch" type="checkbox" role="switch" ${cheked_coin} id="${coin.symbol}">
								<label class="form-check-label" for="flexSwitchCheckDefault"></label>
							</div>
						</div>`);

						$('.containerSearch').show();
						
						$('.btnTezuga').on('click', async(e)=>{
							checkTimeCoin(e);
						});

                        $('.checkSearch').on('change', async(e)=>{ 
				
                            if(e.target.checked){
                                document.getElementById(e.target.id).checked='checked';
                                e.target.checked='checked'
                            } else {
                                document.getElementById(e.target.id).checked='';
                                e.target.checked=''
                            }
							checkEvent(e.target);
						});
					}
			}
		} else {
					$('.container').show();
					$('.containerSearch').hide();
		}
    })
})
   
// מהכיתה
window.onload = function () {

            // let interval = undefined;
            // let prices = { 'BTC': [], 'ETH': [] };
            // interval = setInterval(async () => {
            //     let data = await fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD').then(res => res.json());
            //     for (const myCoin in data) {
            //         prices[myCoin].push({
            //             date: new Date(),
            //             price: data[myCoin].USD
            //         });
            //     }
            //     $("#chartContainer").CanvasJSChart(options).render();
            // }, 2000);

var options = {
	exportEnabled: true,
	animationEnabled: true,
	title:{
		text: "Coins to Usd"
	},

	axisX: {
		title: "States Time"
	},
	axisY: {
		title: "Coins Value",
		titleFontColor: "#4F81BC",
		lineColor: "#4F81BC",
		labelFontColor: "#4F81BC",
		tickColor: "#4F81BC"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		itemclick: toggleDataSeries
	},
	data: [{
		type: "spline",
		name: "Units Sold",
		showInLegend: true,
		xValueFormatString: "MMM YYYY",
		yValueFormatString: "#,##0 Units",
		dataPoints: [
			{ x: new Date(2016, 0, 1),  y: 120 },
			{ x: new Date(2016, 1, 1), y: 135 },
			{ x: new Date(2016, 2, 1), y: 144 },
			{ x: new Date(2016, 3, 1),  y: 103 },
			{ x: new Date(2016, 4, 1),  y: 93 },
			{ x: new Date(2016, 5, 1),  y: 129 },
			{ x: new Date(2016, 6, 1), y: 143 },
			{ x: new Date(2016, 7, 1), y: 156 },
			{ x: new Date(2016, 8, 1),  y: 122 },
			{ x: new Date(2016, 9, 1),  y: 106 },
			{ x: new Date(2016, 10, 1),  y: 137 },
			{ x: new Date(2016, 11, 1), y: 142 }
		]
	},
	{
		type: "spline",
		name: "Profit",
		axisYType: "secondary",
		showInLegend: true,
		xValueFormatString: "MMM YYYY",
		yValueFormatString: "$#,##0.#",
		dataPoints: [
			{ x: new Date(2016, 0, 1),  y: 19034.5 },
			{ x: new Date(2016, 1, 1), y: 20015 },
			{ x: new Date(2016, 2, 1), y: 27342 },
			{ x: new Date(2016, 3, 1),  y: 20088 },
			{ x: new Date(2016, 4, 1),  y: 20234 },
			{ x: new Date(2016, 5, 1),  y: 29034 },
			{ x: new Date(2016, 6, 1), y: 30487 },
			{ x: new Date(2016, 7, 1), y: 32523 },
			{ x: new Date(2016, 8, 1),  y: 20234 },
			{ x: new Date(2016, 9, 1),  y: 27234 },
			{ x: new Date(2016, 10, 1),  y: 33548 },
			{ x: new Date(2016, 11, 1), y: 32534 }
		]
	}]
};

$("#chartContainer").CanvasJSChart(options);

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
    }
}
 