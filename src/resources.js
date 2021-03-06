import { global, keyMultiplier, poppers, breakdown, sizeApproximation, p_on, red_on, achieve_level } from './vars.js';
import { vBind, clearElement, modRes, calc_mastery, easterEgg } from './functions.js';
import { races, traits } from './races.js';
import { loc } from './locale.js';

export const resource_values = {
    Food: 5,
    Lumber: 5,
    Stone: 5,
    Furs: 8,
    Copper: 25,
    Iron: 40,
    Aluminium: 50,
    Cement: 15,
    Coal: 20,
    Oil: 75,
    Uranium: 550,
    Steel: 100,
    Titanium: 150,
    Alloy: 350,
    Polymer: 250,
    Iridium: 420,
    Helium_3: 620,
    Deuterium: 950,
    Elerium: 2000,
    Neutronium: 1500,
    Adamantite: 2250,
    Infernite: 2750,
    Nano_Tube: 750,
    Graphene: 3000,
    Stanene: 3600,
    Bolognium: 9000,
    Vitreloy: 10200,
    Orichalcum: 99000,
    Genes: 0,
    Soul_Gem: 0,
};

export const tradeRatio = {
    Food: 2,
    Lumber: 2,
    Stone: 2,
    Furs: 1,
    Copper: 1,
    Iron: 1,
    Aluminium: 1,
    Cement: 1,
    Coal: 1,
    Oil: 0.5,
    Uranium: 0.12,
    Steel: 0.5,
    Titanium: 0.25,
    Alloy: 0.2,
    Polymer: 0.2,
    Iridium: 0.1,
    Helium_3: 0.1,
    Deuterium: 0.1,
    Elerium: 0.02,
    Neutronium: 0.05,
    Adamantite: 0.05,
    Infernite: 0.01,
    Nano_Tube: 0.1,
    Graphene: 0.1,
    Stanene: 0.1,
    Bolognium: 0.12,
    Vitreloy: 0.12,
    Orichalcum: 0.05,
}

export const atomic_mass = {
    Food: 4.355,
    Lumber: 7.668,
    Stone: 20.017,
    Furs: 13.009,
    Copper: 63.546,
    Iron: 55.845,
    Aluminium: 26.9815,
    Cement: 20.009,
    Coal: 12.0107,
    Oil: 5.342,
    Uranium: 238.0289,
    Steel: 55.9,
    Titanium: 47.867,
    Alloy: 45.264,
    Polymer: 120.054,
    Iridium: 192.217,
    Helium_3: 3.0026,
    Deuterium: 2.014,
    Neutronium: 248.74,
    Adamantite: 178.803,
    Infernite: 222.666,
    Elerium: 297.115,
    Nano_Tube: 15.083,
    Graphene: 26.9615,
    Stanene: 33.9615,
    Bolognium: 75.898,
    Vitreloy: 41.08,
    Orichalcum: 237.8,
    Plywood: 7.666,
    Brick: 20.009,
    Wrought_Iron: 55.845,
    Sheet_Metal: 26.9815,
    Mythril: 94.239,
    Aerogel: 7.84,
    Nanoweave: 23.71
};

export function craftCost(){
    return global.race['wasteful'] 
        ? {
            Plywood: [{ r: 'Lumber', a: 110 }],
            Brick: [{ r: 'Cement', a: 44 }],
            Wrought_Iron: [{ r: 'Iron', a: 88 }],
            Sheet_Metal: [{ r: 'Aluminium', a: 132 }],
            Mythril: [{ r: 'Iridium', a: 110 },{ r: 'Alloy', a: 275 }],
            Aerogel: [{ r: 'Graphene', a: 2750 },{ r: 'Infernite', a: 55 }],
            Nanoweave: [{ r: 'Nano_Tube', a: 1100 },{ r: 'Vitreloy', a: 44 }],
        }
        : {
            Plywood: [{ r: 'Lumber', a: 100 }],
            Brick: [{ r: 'Cement', a: 40 }],
            Wrought_Iron: [{ r: 'Iron', a: 80 }],
            Sheet_Metal: [{ r: 'Aluminium', a: 120 }],
            Mythril: [{ r: 'Iridium', a: 100 },{ r: 'Alloy', a: 250 }],
            Aerogel: [{ r: 'Graphene', a: 2500 },{ r: 'Infernite', a: 50 }],
            Nanoweave: [{ r: 'Nano_Tube', a: 1000 },{ r: 'Vitreloy', a: 40 }],
        };
}

export function craftingRatio(res,auto){
    let skill = global.tech['foundry'] >= 5 ? (global.tech['foundry'] >= 8 ? 0.08 : 0.05) : 0.03;
    let multiplier = global.tech['foundry'] >= 2 ? 1 + (global.city.foundry.count * skill) : 1;
    if (global.tech['foundry'] >= 3 && global.city.foundry[res] > 1){
        multiplier += (global.city.foundry[res] - 1) * 0.03;
    }
    if (global.tech['foundry'] >= 4 && res === 'Plywood' && global.city['sawmill']){
        multiplier += global.city['sawmill'].count * 0.02;
    }
    if (global.tech['foundry'] >= 6 && res === 'Brick'){
        multiplier += global.city['foundry'].count * 0.02;
    }
    if (global.tech['foundry'] >= 7){
        multiplier += p_on['factory'] * 0.05;
        if (global.tech['mars'] >= 4){
            multiplier += p_on['red_factory'] * 0.05;
        }
        if (global.interstellar['int_factory'] && p_on['int_factory']){
            multiplier += p_on['int_factory'] * 0.1;
        }
    }
    if (global.space['fabrication']){
        multiplier += red_on['fabrication'] * global.civic.colonist.workers * 0.02;
    }
    if (res === 'Mythril' && p_on['stellar_forge']){
        multiplier += p_on['stellar_forge'] * 0.05;
    }
    if (auto && p_on['stellar_forge']){
        multiplier += p_on['stellar_forge'] * 0.1;
    }
    if (global.race['crafty']){
        multiplier += 0.03;
    }
    if (global.race['ambidextrous']){
        multiplier += (global.race['ambidextrous'] * 0.03);
    }
    if (global.race['rigid']){
        multiplier -= traits.rigid.vars[0] / 100;
    }
    if (global.civic.govern.type === 'socialist'){
        multiplier *= 1.25;
    }
    if (auto){
        if (global.tech['v_train']){
            multiplier *= 2;
        }
        if (global.genes['crafty']){
            multiplier *= 1 + ((global.genes.crafty - 1) * 0.5);
        }
        if (global.race['ambidextrous']){
            multiplier *= 1 + (global.race['ambidextrous'] * 0.02);
        }
    }
    if (global.race.Plasmid.count > 0){
        multiplier *= plasmidBonus() / 8 + 1;
    }
    if (global.race['no_plasmid']){
        if (global.city['temple'] && global.city['temple'].count){
            let temple_bonus = global.tech['anthropology'] && global.tech['anthropology'] >= 1 ? 0.016 : 0.01;
            if (global.tech['fanaticism'] && global.tech['fanaticism'] >= 2){
                temple_bonus += global.civic.professor.workers * 0.0004;
            }
            multiplier *= 1 + (global.city.temple.count * temple_bonus / 4);
        }
    }
    if (global.genes['challenge'] && global.genes['challenge'] >= 2){
        multiplier *= 1 + (achieve_level * 0.0025);
    }
    return multiplier;
}

if (global.resource[races[global.race.species].name]){
    global.resource[global.race.species] = global.resource[races[global.race.species].name];
    delete global.resource[races[global.race.species].name];
}

// Sets up resource definitions
export function defineResources(){
    if (global.race.species === 'protoplasm'){
        let base = 100;
        if (global.stats.achieve['mass_extinction'] && global.stats.achieve['mass_extinction'].l > 1){
            base += 50 * (global.stats.achieve['mass_extinction'].l - 1);
        }
        loadResource('RNA',base,1,false);
        loadResource('DNA',base,1,false);
    }
    else {
        initMarket();
        initStorage();
        initEjector();
    }
    
    loadResource('Money',1000,1,false,false,'success');
    loadResource(global.race.species,0,0,false,false,'warning');
    loadResource('Slave',0,0,false,false,'warning');
    loadResource('Knowledge',100,1,false,false,'warning');
    loadResource('Crates',0,0,false,false,'warning');
    loadResource('Containers',0,0,false,false,'warning');
    loadResource('Food',250,1,true,true);
    loadResource('Lumber',200,1,true,true);
    loadResource('Stone',200,1,true,true);
    loadResource('Furs',100,1,true,true);
    loadResource('Copper',100,1,true,true);
    loadResource('Iron',100,1,true,true);
    loadResource('Aluminium',50,1,true,true);
    loadResource('Cement',100,1,true,true);
    loadResource('Coal',50,1,true,true);
    loadResource('Oil',0,1,true,false);
    loadResource('Uranium',10,1,true,false);
    loadResource('Steel',50,1,true,true);
    loadResource('Titanium',50,1,true,true);
    loadResource('Alloy',50,1,true,true);
    loadResource('Polymer',50,1,true,true);
    loadResource('Iridium',0,1,true,true);
    loadResource('Helium_3',0,1,true,false);
    loadResource('Deuterium',0,1,false,false,'advanced');
    loadResource('Neutronium',0,1,false,false,'advanced');
    loadResource('Adamantite',0,1,false,true,'advanced');
    loadResource('Infernite',0,1,false,false,'advanced');
    loadResource('Elerium',1,1,false,false,'advanced');
    loadResource('Nano_Tube',0,1,false,false,'advanced');
    loadResource('Graphene',0,1,false,true,'advanced');
    loadResource('Stanene',0,1,false,true,'advanced');
    loadResource('Bolognium',0,1,false,true,'advanced');
    loadResource('Vitreloy',0,1,false,true,'advanced');
    loadResource('Orichalcum',0,1,false,true,'advanced');
    loadResource('Genes',-2,0,false,false,'advanced');
    loadResource('Soul_Gem',-2,0,false,false,'advanced');
    loadResource('Plywood',-1,0,false,false,'danger');
    loadResource('Brick',-1,0,false,false,'danger');
    loadResource('Wrought_Iron',-1,0,false,false,'danger');
    loadResource('Sheet_Metal',-1,0,false,false,'danger');
    loadResource('Mythril',-1,0,false,false,'danger');
    loadResource('Aerogel',-1,0,false,false,'danger');
    loadResource('Nanoweave',-1,0,false,false,'danger');

    if (global.race.species !== 'protoplasm'){
        loadRouteCounter();
        loadContainerCounter();
        initGalaxyTrade();
    }
    loadSpecialResource('Plasmid');
    loadSpecialResource('AntiPlasmid');
    loadSpecialResource('Phage');
    loadSpecialResource('Dark');
    loadSpecialResource('Harmony');
}

// Load resource function
// This function defines each resource, loads saved values from localStorage
// And it creates Vue binds for various resource values
function loadResource(name,max,rate,tradable,stackable,color){
    color = color || 'info';
    if (!global['resource'][name]){
        global['resource'][name] = {
            name: name === global.race.species ? races[global.race.species].name : (name === 'Money' ? '$' : loc(`resource_${name}_name`)),
            display: false,
            value: resource_values[name],
            amount: 0,
            crates: 0,
            diff: 0,
            delta: 0,
            max: max,
            rate: rate
        };
    }
    else {
        global['resource'][name].name = name === global.race.species ? races[global.race.species].name : (name === 'Money' ? '$' : loc(`resource_${name}_name`));
    }

    if (global.race['soul_eater']){
        switch(name){
            case 'Food':
                global['resource'][name].name = loc('resource_Souls_name');
                break;
        }
    }

    if (global.race['evil']){
        switch(name){
            case 'Lumber':
                global['resource'][name].name = loc('resource_Bones_name');
                break;
            case 'Furs':
                global['resource'][name].name = loc('resource_Flesh_name');
                break;
            case 'Plywood':
                global['resource'][name].name = loc('resource_Boneweave_name');
                break;
        }
    }

    const date = new Date();
    if (date.getMonth() === 9 && date.getDate() === 31){
        switch(name){
            case 'Food':
                global['resource'][name].name = loc('resource_Candy_name');
                break;
            case 'Lumber':
                global['resource'][name].name = loc('resource_Bones_name');
                break;
            case 'Stone':
                global['resource'][name].name = loc('resource_RockCandy_name');
                break;
            case 'Furs':
                global['resource'][name].name = loc('resource_Webs_name');
                break;
            case 'Plywood':
                global['resource'][name].name = loc('resource_Boneweave_name');
                break;
            case 'Soul_Gem':
                global['resource'][name].name = loc('resource_CandyCorn_name');
                break;
        }
    }

    global['resource'][name]['stackable'] = stackable;
    if (!global['resource'][name]['crates']){
        global['resource'][name]['crates'] = 0;
    }
    if (!global['resource'][name]['containers']){
        global['resource'][name]['containers'] = 0;
    }
    if (!global['resource'][name]['delta']){
        global['resource'][name]['delta'] = 0;
    }
    if (!global['resource'][name]['trade'] && tradable){
        global['resource'][name]['trade'] = 0;
    }

    var res_container;
    if (global.resource[name].max === -1 || global.resource[name].max === -2){
        res_container = $(`<div id="res${name}" class="resource crafted" v-show="display"><h3 class="res has-text-${color}">{{ name | namespace }}</h3><span id="cnt${name}" class="count">{{ amount | diffSize }}</span></div>`);
    }
    else {
        res_container = $(`<div id="res${name}" class="resource" v-show="display"><h3 class="res has-text-${color}">{{ name | namespace }}</h3><span id="cnt${name}" class="count">{{ amount | size }} / {{ max | size }}</span></div>`);
    }

    if (stackable){
        res_container.append($(`<span><span id="con${name}" v-if="showTrigger()" class="interact has-text-success" @click="trigModal" role="button" aria-label="Open crate management for ${name}">+</span></span>`));
    }
    else if (max !== -1 || (max === -1 && rate === 0 && global.race['no_craft'])){
        res_container.append($('<span></span>'));
    }
    
    if (rate !== 0 || (max === -1 && rate === 0 && global.race['no_craft'])){
        res_container.append($(`<span id="inc${name}" class="diff" :aria-label="resRate('${name}')">{{ diff | diffSize }} /s</span>`));
    }
    else if (max === -1 && !global.race['no_craft']){
        let craft = $('<span class="craftable"></span>');
        res_container.append(craft);

        let inc = [1,5];
        for (let i=0; i<inc.length; i++){
            craft.append($(`<span id="inc${name}${inc[i]}" @mouseover="hover('${name}',${inc[i]})" @mouseout="unhover('${name}',${inc[i]})"><a @click="craft('${name}',${inc[i]})" aria-label="craft ${inc[i]} ${name}">+<span class="craft" data-val="${inc[i]}">${inc[i]}</span></a></span>`));
        }
        craft.append($(`<span id="inc${name}A" @mouseover="hover('${name}','A')" @mouseout="unhover('${name}','A')"><a @click="craft('${name}','A')" aria-label="craft max ${name}">+<span class="craft" data-val="${'A'}">A</span></a></span>`));
    }
    else {
        res_container.append($(`<span></span>`));
    }
    
    $('#resources').append(res_container);

    var modal = {
            template: '<div id="modalBox" class="modalBox"></div>'
        };
    
    vBind({
        el: `#res${name}`,
        data: global['resource'][name], 
        filters: {
            size: function (value){
                return sizeApproximation(value,0);
            },
            diffSize: function (value){
                return sizeApproximation(value,2);
            },
            namespace(val){
                return val.replace("_", " ");
            }
        },
        methods: {
            resRate(n){
                let diff = sizeApproximation(global.resource[n].diff,2);
                return `${n} ${diff} per second`;
            },
            trigModal(){
                this.$buefy.modal.open({
                    parent: this,
                    component: modal
                });
                
                var checkExist = setInterval(function(){
                   if ($('#modalBox').length > 0) {
                      clearInterval(checkExist);
                      drawModal(name,color);
                   }
                }, 50);
            },
            showTrigger(){
                return global.resource.Crates.display;
            },
            craft(res,vol){
                if (!global.race['no_craft']){
                    let craft_bonus = craftingRatio(res);
                    let craft_costs = craftCost();
                    let volume = Math.floor(global.resource[craft_costs[res][0].r].amount / craft_costs[res][0].a);
                    for (let i=1; i<craft_costs[res].length; i++){
                        let temp = Math.floor(global.resource[craft_costs[res][i].r].amount / craft_costs[res][i].a);
                        if (temp < volume){
                            volume = temp;
                        }
                    }
                    if (vol !== 'A'){
                        let total = vol * keyMultiplier();
                        if (total < volume){
                            volume = total;
                        }
                    }
                    for (let i=0; i<craft_costs[res].length; i++){
                        let num = volume * craft_costs[res][i].a;
                        global.resource[craft_costs[res][i].r].amount -= num;
                    }
                    global.resource[res].amount += volume * craft_bonus;
                }
            },
            craftCost(res,vol){
                let costs = '';
                let craft_costs = craftCost();
                for (let i=0; i<craft_costs[res].length; i++){
                    let num = vol * craft_costs[res][i].a * keyMultiplier();
                    costs = costs + `<div>${global.resource[craft_costs[res][i].r].name} ${num}</div>`;
                }
                return costs;
            },
            hover(res,vol){
                var popper = $(`<div id="popRes${res}${vol}" class="popper has-background-light has-text-dark"></div>`);
                $('#main').append(popper);

                let bonus = (craftingRatio(res) * 100).toFixed(0);
                popper.append($(`<div class="has-text-info">${loc('manual_crafting_hover_bonus',[bonus,global.resource[res].name])}</div>`));
                
                let craft_costs = craftCost();
                let crafts = $(`<div><span class="has-text-success">${loc('manual_crafting_hover_craft')} </span></div>`);
                let num_crafted = 0;
                if (typeof vol !== 'number'){
                    num_crafted = global.resource[craft_costs[res][0].r].amount / craft_costs[res][0].a;
                    if (craft_costs[res].length > 1){
                        for (let i=1; i<craft_costs[res].length; i++){
                            let curr_max = global.resource[craft_costs[res][i].r].amount / craft_costs[res][i].a;
                            if (curr_max < num_crafted){
                                num_crafted = curr_max;
                            }
                        }
                    }
                    crafts.append($(`<span class="has-text-advanced">${sizeApproximation((bonus / 100) * num_crafted,1)} ${global.resource[res].name}</span>`));
                }
                else {
                    num_crafted = keyMultiplier() * vol;
                    let total_crafted = sizeApproximation((bonus / 100) * num_crafted,1);
                    crafts.append($(`<span class="has-text-advanced"><span class="craft" data-val="${(sizeApproximation((bonus / 100) * vol))}">${total_crafted}</span> ${global.resource[res].name}</span>`));
                }
                let costs = $(`<div><span class="has-text-danger">${loc('manual_crafting_hover_use')} </span></div>`);
                for (let i=0; i<craft_costs[res].length; i++){
                    costs.append($(`<span class="craft-elm has-text-caution">${sizeApproximation(num_crafted * craft_costs[res][i].a,1)} ${global.resource[craft_costs[res][i].r].name}</span>`));
                    if (i + 1 < craft_costs[res].length){
                        costs.append($(`<span>, </span>`));
                    }
                }
                popper.append(crafts);
                popper.append(costs);
                
                popper.show();
                poppers[`r${res}${vol}`] = new Popper($(`#inc${res}${vol}`),popper);
            },
            unhover(res,vol){
                $(`#popRes${res}${vol}`).hide();
                poppers[`r${res}${vol}`].destroy();
                clearElement($(`#popRes${res}${vol}`),true);
            }
        }
    });

    breakdownPopover(`cnt${name}`,name,'c');

    if (stackable){
        $(`#con${name}`).on('mouseover',function(){
            var popper = $(`<div id="popContainer${name}" class="popper has-background-light has-text-dark"></div>`);
            $('#main').append(popper);
            popper.append($(`<div>Crates ${global.resource[name].crates}</div>`));
            if (global.tech['steel_container']){
                popper.append($(`<div>Containers ${global.resource[name].containers}</div>`));
            }
            popper.show();
            poppers[name] = new Popper($(`#con${name}`),popper);
        });
        $(`#con${name}`).on('mouseout',function(){
            $(`#popContainer${name}`).hide();
            poppers[name].destroy();
            clearElement($(`#popContainer${name}`),true);
        });
        var market_item = $(`<div id="stack-${name}" class="market-item" v-show="display"></div>`);
        $('#resStorage').append(market_item);
        containerItem(`#stack-${name}`,market_item,name,color,true);
    }

    if (name !== global.race.species && name !== 'Crates' && name !== 'Containers' && max !== -1){
        breakdownPopover(`inc${name}`,name,'p');
    }

    if (tradable){
        var market_item = $(`<div id="market-${name}" class="market-item" v-show="r.display"></div>`);
        $('#market').append(market_item);
        marketItem(`#market-${name}`,market_item,name,color,true);
    }

    $(`#res${name}`).on('mouseover',function(){
        $(`.res-${name}`).each(function(){
            if (global.resource[name].amount >= $(this).attr(`data-${name}`)){
                $(this).addClass('hl-ca');
            }
            else {
                $(this).addClass('hl-cna');
            }
        });
    });
    $(`#res${name}`).on('mouseout',function(){
        $(`.res-${name}`).each(function(){
            $(this).removeClass('hl-ca');
            $(this).removeClass('hl-cna');
        });
    });

    if (atomic_mass[name]){
        loadEjector(name,color);
    }
}

function loadSpecialResource(name,color) {
    if ($(`#res${name}`).length){
        let bind = $(`#res${name}`);
        bind.detach;
        $('#resources').append(bind);
        return;
    }
    color = color || 'special';
    let bind = name;
    
    if (name === 'AntiPlasmid'){
        var res_container = $(`<div id="res${name}" class="resource" v-show="anti"><span class="res has-text-${color}">${loc(`resource_${name}_name`)}</span><span class="count">{{ anti }}</span></div>`);
        $('#resources').append(res_container);
        bind = 'Plasmid';
    }
    else {
        var res_container = $(`<div id="res${name}" class="resource" v-show="count"><span class="res has-text-${color}">${loc(`resource_${name}_name`)}</span><span class="count">{{ count }}</span></div>`);
        $('#resources').append(res_container);
    }
    
    vBind({
        el: `#res${name}`,
        data: global.race[bind]
    });
}

function marketItem(mount,market_item,name,color,full){
    if (full){
        market_item.append($(`<h3 class="res has-text-${color}">{{ r.name | namespace }}</h3>`));
    }

    if (!global.race['no_trade']){
        market_item.append($(`<span class="buy"><span class="has-text-success">${loc('resource_market_buy')}</span></span>`));
        market_item.append($(`<span role="button" class="order" @click="purchase('${name}')">\${{ r.value | buy }}</span>`));
        
        market_item.append($(`<span class="sell"><span class="has-text-danger">${loc('resource_market_sell')}</span></span>`));
        market_item.append($(`<span role="button" class="order" @click="sell('${name}')">\${{ r.value | sell }}</span>`));
    }

    if (full){
        let trade = $(`<span class="trade" v-show="m.active"><span class="has-text-warning">${loc('resource_market_routes')}</span></span>`);
        market_item.append(trade);
        trade.append($(`<b-tooltip :label="aSell('${name}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="export ${name}" class="sub has-text-danger" @click="autoSell('${name}')"><span>-</span></span></b-tooltip>`));
        trade.append($(`<span class="current">{{ r.trade | trade }}</span>`));
        trade.append($(`<b-tooltip :label="aBuy('${name}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="import ${name}" class="add has-text-success" @click="autoBuy('${name}')"><span>+</span></span></b-tooltip>`));
        trade.append($(`<span role="button" class="zero has-text-advanced" @click="zero('${name}')">${loc('cancel_routes')}</span>`));
        tradeRouteColor(name);
    }
    
    vBind({
        el: mount,
        data: { 
            r: global.resource[name],
            m: global.city.market
        },
        methods: {
            aSell(res){
                let unit = tradeRatio[res] === 1 ? loc('resource_market_unit') : loc('resource_market_units');
                let price = tradeSellPrice(res);
                return loc('resource_market_auto_sell_desc',[tradeRatio[res],unit,price]);
            },
            aBuy(res){
                let rate = tradeRatio[res];
                if (global.race['persuasive']){
                    rate *= 1 + (global.race['persuasive'] / 100);
                }
                if (global.genes['trader']){
                    let mastery = calc_mastery();
                    rate *= 1 + (mastery / 100);
                }
                rate = +(rate).toFixed(2);
                let unit = rate === 1 ? loc('resource_market_unit') : loc('resource_market_units');
                let price = tradeBuyPrice(res);
                return loc('resource_market_auto_buy_desc',[rate,unit,price]);
            },
            purchase(res){
                if (!global.race['no_trade']){
                    let qty = global.city.market.qty;
                    let value = global.resource[res].value;
                    if (global.race['arrogant']){
                        value *= 1 + (traits.arrogant.vars[0] / 100);
                    }
                    if (global.race['conniving']){
                        value *= 1 - (traits.conniving.vars[0] / 100);
                    }
                    var price = Math.round(value * qty);
                    if (global.resource.Money.amount >= price){
                        global.resource[res].amount += Number(qty);
                        global.resource.Money.amount -= Number(price);
                        
                        global.resource[res].value += Number((qty / Math.rand(1000,10000)).toFixed(2));
                    }
                }
            },
            sell(res){
                if (!global.race['no_trade']){
                    var qty = global.city.market.qty;
                    if (global.resource[res].amount >= qty){
                        let divide = 4;
                        if (global.race['merchant']){
                            divide *= 1 - (traits.merchant.vars[0] / 100);
                        }
                        if (global.race['asymmetrical']){
                            divide *= 1 + (traits.asymmetrical.vars[0] / 100);
                        }
                        if (global.race['conniving']){
                            divide *= 1 - (traits.conniving.vars[1] / 100);
                        } 
                        let price = Math.round(global.resource[res].value * qty / divide);
                        global.resource[res].amount -= Number(qty);
                        global.resource.Money.amount += Number(price);
                        
                        global.resource[res].value -= Number((qty / Math.rand(1000,10000)).toFixed(2));
                        if (global.resource[res].value < Number(resource_values[res] / 2)){
                            global.resource[res].value = Number(resource_values[res] / 2);
                        }
                    }
                }
            },
            autoBuy(res){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if (global.resource[res].trade >= 0){
                        if (global.city.market.trade < global.city.market.mtrade){
                            global.city.market.trade++;
                            global.resource[res].trade++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        global.city.market.trade--;
                        global.resource[res].trade++;
                    }
                }
                tradeRouteColor(res);
            },
            autoSell(res){
                let keyMult = keyMultiplier();
                for (let i=0; i<keyMult; i++){
                    if (global.resource[res].trade <= 0){
                        if (global.city.market.trade < global.city.market.mtrade){
                            global.city.market.trade++;
                            global.resource[res].trade--;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        global.city.market.trade--;
                        global.resource[res].trade--;
                    }
                }
                tradeRouteColor(res);
            },
            zero(res){
                global.city.market.trade += global.resource[res].trade;
                global.resource[res].trade = 0;
                tradeRouteColor(res);
            }
        },
        filters: {
            buy(value){
                if (global.race['arrogant']){
                    value *= 1 + (traits.arrogant.vars[0] / 100);
                }
                return sizeApproximation(value * global.city.market.qty,0);
            },
            sell(value){
                let divide = 4;
                if (global.race['merchant']){
                    divide *= 1 - (traits.merchant.vars[0] / 100);
                }
                if (global.race['asymmetrical']){
                    divide *= 1 + (traits.asymmetrical.vars[0] / 100);
                }
                return sizeApproximation(value * global.city.market.qty / divide,0);
            },
            trade(val){
                if (val < 0){
                    val = 0 - val;
                    return `-${val}`;
                }
                else if (val > 0){
                    return `+${val}`;
                }
                else {
                    return 0;
                }
            },
            namespace(val){
                return val.replace("_", " ");
            }
        }
    });
}

function initGalaxyTrade(){
    $('#market').append($(`<div id="galaxyTrade" v-show="t.xeno && t.xeno >= 5" class="market-header galaxyTrade"><h2 class="is-sr-only">${loc('galaxy_trade')}</h2></div>`));
    galacticTrade();
}

export const galaxyOffers = [
    {
        buy: { res: 'Deuterium', vol: 5 },
        sell: { res: 'Helium_3', vol: 25 }
    },
    {
        buy: { res: 'Neutronium', vol: 2.5 },
        sell: { res: 'Copper', vol: 200 }
    },
    {
        buy: { res: 'Adamantite', vol: 3 },
        sell: { res: 'Iron', vol: 300 }
    },
    {
        buy: { res: 'Elerium', vol: 1 },
        sell: { res: 'Oil', vol: 125 }
    },
    {
        buy: { res: 'Nano_Tube', vol: 10 },
        sell: { res: 'Titanium', vol: 20 }
    },
    {
        buy: { res: 'Graphene', vol: 25 },
        sell: { res: 'Lumber', vol: 1000 }
    },
    {
        buy: { res: 'Stanene', vol: 40 },
        sell: { res: 'Aluminium', vol: 800 }
    },
    {
        buy: { res: 'Bolognium', vol: 0.75 },
        sell: { res: 'Uranium', vol: 4 }
    },
    {
        buy: { res: 'Vitreloy', vol: 1 },
        sell: { res: 'Infernite', vol: 1 }
    }
];

export function galacticTrade(modal){
    let galaxyTrade = modal ? modal : $(`#galaxyTrade`);
    if (!modal){
        $(`#galaxyTrade`).empty();
    }

    if (global.galaxy['trade']){
        galaxyTrade.append($(`<div class="market-item trade-header"><span class="has-text-special">${loc('galaxy_trade')}</span></div>`));

        for (let i=0; i<galaxyOffers.length; i++){
            let offer = $(`<div class="market-item trade-offer"></div>`);
            galaxyTrade.append(offer);

            offer.append($(`<span class="offer-item has-text-success">${global.resource[galaxyOffers[i].buy.res].name}</span>`));
            offer.append($(`<span class="offer-vol has-text-advanced">+{{ '${i}' | t_vol }}/s</span>`));
            
            offer.append($(`<span class="offer-item has-text-danger">${global.resource[galaxyOffers[i].sell.res].name}</span>`));
            offer.append($(`<span class="offer-vol has-text-caution">-${galaxyOffers[i].sell.vol}/s</span>`));

            let trade = $(`<span class="trade"><span class="has-text-warning">${loc('resource_market_routes')}</span></span>`);
            offer.append(trade);
            
            let assign = loc('galaxy_freighter_assign',[global.resource[galaxyOffers[i].buy.res].name,global.resource[galaxyOffers[i].sell.res].name]);
            let unassign = loc('galaxy_freighter_unassign',[global.resource[galaxyOffers[i].buy.res].name,global.resource[galaxyOffers[i].sell.res].name]);
            trade.append($(`<b-tooltip :label="desc('${unassign}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="${unassign}" class="sub has-text-danger" @click="less('${i}')"><span>-</span></span></b-tooltip>`));
            trade.append($(`<span class="current">{{ g.f${i} }}</span>`));
            trade.append($(`<b-tooltip :label="desc('${assign}')" position="is-bottom" size="is-small" multilined animated><span role="button" aria-label="${assign}" class="add has-text-success" @click="more('${i}')"><span>+</span></span></b-tooltip>`));
        }

        let totals = $(`<div class="market-item trade-offer"><span class="tradeTotal"><span class="has-text-caution">${loc('resource_market_galactic_trade_routes')}</span> {{ g.cur }} / {{ g.max }}</span></div>`);
        galaxyTrade.append(totals);
    }

    vBind({
        el: modal ? '#specialModal' : '#galaxyTrade',
        data: {
            g: global.galaxy.trade,
            t: global.tech
        },
        methods: {
            less(idx){
                let keyMutipler = keyMultiplier();
                if (global.galaxy.trade[`f${idx}`] >= keyMutipler){
                    global.galaxy.trade[`f${idx}`] -= keyMutipler;
                }
                else {
                    global.galaxy.trade[`f${idx}`] = 0;
                }
            },
            more(idx){
                let keyMutipler = keyMultiplier();
                if (global.galaxy.trade.cur < global.galaxy.trade.max){
                    if (keyMutipler > global.galaxy.trade.max - global.galaxy.trade.cur){
                        keyMutipler = global.galaxy.trade.max - global.galaxy.trade.cur;
                    }
                    global.galaxy.trade[`f${idx}`] += keyMutipler;
                }
            },
            desc(s){
                return s; 
            }
        },
        filters: {
            t_vol(idx){
                let buy_vol = galaxyOffers[idx].buy.vol;
                if (global.race['persuasive']){
                    buy_vol *= 1 + (global.race['persuasive'] / 100);
                }
                if (global.genes['trader']){
                    let mastery = calc_mastery();
                    buy_vol *= 1 + (mastery / 100);
                }
                buy_vol = +(buy_vol).toFixed(2);
                return buy_vol;
            }
        }
    });
}

function unassignCrate(res){
    let keyMutipler = keyMultiplier();
    let cap = crateValue();
    if (keyMutipler > global.resource[res].crates){
        keyMutipler = global.resource[res].crates;
    }
    if (keyMutipler > 0){
        global.resource.Crates.amount += keyMutipler;
        global.resource.Crates.max += keyMutipler;
        global.resource[res].crates -= keyMutipler;
        global.resource[res].max -= (cap * keyMutipler);
    }
}

function assignCrate(res){
    let keyMutipler = keyMultiplier();
    let cap = crateValue();
    if (keyMutipler > global.resource.Crates.amount){
        keyMutipler = global.resource.Crates.amount;
    }
    if (keyMutipler > 0){
        global.resource.Crates.amount -= keyMutipler;
        global.resource.Crates.max -= keyMutipler;
        global.resource[res].crates += keyMutipler;
        global.resource[res].max += (cap * keyMutipler);
    }
}

function unassignContainer(res){
    let keyMutipler = keyMultiplier();
    let cap = containerValue();
    if (keyMutipler > global.resource[res].containers){
        keyMutipler = global.resource[res].containers;
    }
    if (keyMutipler > 0){
        global.resource.Containers.amount += keyMutipler;
        global.resource.Containers.max += keyMutipler;
        global.resource[res].containers -= keyMutipler;
        global.resource[res].max -= (cap * keyMutipler);
    }
}

function assignContainer(res){
    let keyMutipler = keyMultiplier();
    let cap = containerValue();
    if (keyMutipler > global.resource.Containers.amount){
        keyMutipler = global.resource.Containers.amount;
    }
    if (keyMutipler > 0){
        global.resource.Containers.amount -= keyMutipler;
        global.resource.Containers.max -= keyMutipler;
        global.resource[res].containers += keyMutipler;
        global.resource[res].max += (cap * keyMutipler);
    }
}

function containerItem(mount,market_item,name,color){
    market_item.append($(`<h3 class="res has-text-${color}">{{ name }}</h3>`));

    if (global.resource.Crates.display){
        let crate = $(`<span class="trade"><span class="has-text-warning">${loc('resource_Crates_name')}</span></span>`);
        market_item.append(crate);

        crate.append($(`<span role="button" aria-label="remove ${name} ${loc('resource_Crates_name')}" class="sub has-text-danger" @click="subCrate('${name}')"><span>&laquo;</span></span>`));
        crate.append($(`<span class="current">{{ crates }}</span>`));
        crate.append($(`<span role="button" aria-label="add ${name} ${loc('resource_Crates_name')}" class="add has-text-success" @click="addCrate('${name}')"><span>&raquo;</span></span>`));
    }

    if (global.resource.Containers.display){
        let container = $(`<span class="trade"><span class="has-text-warning">${loc('resource_Containers_name')}</span></span>`);
        market_item.append(container);

        container.append($(`<span role="button" aria-label="remove ${name} ${loc('resource_Containers_name')}" class="sub has-text-danger" @click="subCon('${name}')"><span>&laquo;</span></span>`));
        container.append($(`<span class="current">{{ containers }}</span>`));
        container.append($(`<span role="button" aria-label="add ${name} ${loc('resource_Containers_name')}" class="add has-text-success" @click="addCon('${name}')"><span>&raquo;</span></span>`));
    }

    vBind({
        el: mount,
        data: global.resource[name],
        methods: {
            addCrate(res){
                assignCrate(res);
            },
            subCrate(res){
                unassignCrate(res);
            },
            addCon(res){
                assignContainer(res);
            },
            subCon(res){
                unassignContainer(res);
            }
        }
    });
}

export function tradeSellPrice(res){
    let divide = 4;
    if (global.race['merchant']){
        divide *= 1 - (traits.merchant.vars[0] / 100);
    }
    if (global.race['asymmetrical']){
        divide *= 1 + (traits.asymmetrical.vars[0] / 100);
    }
    if (global.race['conniving']){
        divide--;
    }
    let price = global.resource[res].value * tradeRatio[res] / divide;
    if (global.city['wharf']){
        price = price * (1 + (global.city['wharf'].count * 0.01));
    }
    if (global.space['gps'] && global.space['gps'].count > 3){
        price = price * (1 + (global.space['gps'].count * 0.01));
    }
    if (global.tech['railway']){
        price = price * (1 + (global.tech['railway'] * 0.02));
    }
    price = +(price).toFixed(1);
    return price;
}

export function tradeBuyPrice(res){
    let rate = global.resource[res].value;
    if (global.race['arrogant']){
        rate *= 1 + (traits.arrogant.vars[0] / 100);
    }
    if (global.race['conniving']){
        rate *= 1 - (traits.conniving.vars[0] / 100);
    }
    let price = rate * tradeRatio[res];
    if (global.city['wharf']){
        price = price * (0.99 ** global.city['wharf'].count);
    }
    if (global.space['gps'] && global.space['gps'].count > 3){
        price = price * (0.99 ** global.space['gps'].count);
    }
    if (global.tech['railway']){
        price = price * (0.98 ** global.tech['railway']);
    }
    price = +(price).toFixed(1);
    return price;
}

function breakdownPopover(id,name,type){
    $(`#${id}`).on('mouseover',function(){
        
        var popper = $(`<div id="resBreak${id}" class="popper breakdown has-background-light has-text-dark"></div>`);
        $('#main').append(popper);
        let bd = $(`<div class="resBreakdown"><div class="has-text-info">{{ res.name | namespace }}</div></div>`);

        let table = $(`<div class="parent"></div>`);
        bd.append(table);

        if (breakdown[type][name]){
            let col1 = $(`<div></div>`);
            table.append(col1);
            let types = [name,'Global'];
            for (var i = 0; i < types.length; i++){
                let t = types[i];
                if (breakdown[type][t]){
                    Object.keys(breakdown[type][t]).forEach(function (mod){
                        let raw = breakdown[type][t][mod];
                        let val = parseFloat(raw.slice(0,-1));
                        if (val != 0 && !isNaN(val)){
                            let type = val > 0 ? 'success' : 'danger';
                            let label = mod.replace("_"," ");
                            label = mod.replace(/\+.+$/,"");
                            col1.append(`<div class="modal_bd"><span>${label}</span><span class="has-text-${type}">{{ ${t}['${mod}'] | translate }}</span></div>`);
                        }
                    });
                }
            }
        }

        if (breakdown[type].consume && breakdown[type].consume[name]){
            let col2 = $(`<div class="col"></div>`);
            let count = 0;
            Object.keys(breakdown[type].consume[name]).forEach(function (mod){
                count++;
                let val = breakdown[type].consume[name][mod];
                if (val != 0 && !isNaN(val)){
                    let type = val > 0 ? 'success' : 'danger';
                    let label = mod.replace("_"," ");
                    label = mod.replace(/\+.+$/,"");
                    col2.append(`<div class="modal_bd"><span>${label}</span><span class="has-text-${type}">{{ consume.${name}['${mod}'] | fix | translate }}</span></div>`);
                }
            });
            if (count > 0){
                table.append(col2);
            }
        }

        if (type === 'p'){
            let dir = global['resource'][name].diff > 0 ? 'success' : 'danger';
            bd.append(`<div class="modal_bd sum"><span>{{ res.diff | direction }}</span><span class="has-text-${dir}">{{ res.amount | counter }}</span></div>`);
        }

        popper.append(bd);
        popper.show();
        poppers[type+name] = new Popper($(`#${id}`),popper);

        vBind({
            el: `#resBreak${id} > div`,
            data: {
                'Global': breakdown[type]['Global'],
                [name]: breakdown[type][name],
                'consume': breakdown[type]['consume'],
                res: global['resource'][name]
            }, 
            filters: {
                translate(raw){
                    let type = raw[raw.length -1];
                    let val = parseFloat(raw.slice(0,-1));
                    val = +(val).toFixed(2);
                    let suffix = type === '%' ? '%' : '';
                    if (val > 0){
                        return '+' + sizeApproximation(val,2) + suffix;
                    }
                    else if (val < 0){
                        return sizeApproximation(val,2) + suffix;
                    }
                },
                fix(val){
                    return val + 'v';
                },
                counter(val){
                    let rate = global['resource'][name].diff;
                    let time = 0;
                    if (rate < 0){
                        rate *= -1;
                        time = +(val / rate).toFixed(0);
                    }
                    else {
                        let gap = global['resource'][name].max - val;
                        time = +(gap / rate).toFixed(0);
                    }

                    if (time === Infinity || Number.isNaN(time)){
                        return 'Never';
                    }
                    
                    if (time > 60){
                        let secs = time % 60;
                        let mins = (time - secs) / 60;
                        if (mins >= 60){
                            let r = mins % 60;
                            let hours = (mins - r) / 60;
                            return `${hours}h ${r}m`;
                        }
                        else {
                            return `${mins}m ${secs}s`;
                        }
                    }
                    else {
                        return `${time}s`;
                    }
                },
                direction(val){
                    return val >= 0 ? loc('to_full') : loc('to_empty');
                },
                namespace(name){
                    return name.replace("_"," ");
                }
            }
        });
    });
    $(`#${id}`).on('mouseout',function(){
        $(`#resBreak${id}`).hide();
        if (poppers[type+name]){
            poppers[type+name].destroy();
        }
        clearElement($(`#resBreak${id}`),true);
        vBind({el: `#resBreak${id} > div`},'destroy');
    });
}

function loadRouteCounter(){
    let no_market = global.race['no_trade'] ? ' nt' : '';
    var market_item = $(`<div id="tradeTotal" v-show="active" class="market-item"><span class="tradeTotal${no_market}"><span class="has-text-caution">${loc('resource_market_trade_routes')}</span> {{ trade }} / {{ mtrade }}</span></div>`);
    $('#market').append(market_item);
    vBind({
        el: '#tradeTotal',
        data: global.city.market
    });
}

function loadContainerCounter(){
    var market_item = $(`<div id="crateTotal" class="market-item"><span v-show="cr.display" class="crtTotal"><span class="has-text-warning">${loc('resource_Crates_name')}</span><span>{{ cr.amount }} / {{ cr.max }}</span></span><span v-show="cn.display" class="cntTotal"><span class="has-text-warning">${loc('resource_Containers_name')}</span><span>{{ cn.amount }} / {{ cn.max }}</span></span></div>`);
    $('#resStorage').append(market_item);

    vBind({
        el: '#crateTotal',
        data: {
            cr: global.resource.Crates,
            cn: global.resource.Containers
        }
    });
}

function tradeRouteColor(res){
    $(`#market-${res} .trade .current`).removeClass('has-text-warning');
    $(`#market-${res} .trade .current`).removeClass('has-text-danger');
    $(`#market-${res} .trade .current`).removeClass('has-text-success');
    if (global.resource[res].trade > 0){
        $(`#market-${res} .trade .current`).addClass('has-text-success');
    }
    else if (global.resource[res].trade < 0){
        $(`#market-${res} .trade .current`).addClass('has-text-danger');
    }
    else {
        $(`#market-${res} .trade .current`).addClass('has-text-warning');
    }
}

function buildCrateLabel(){
    let material = global.race['kindling_kindred'] ? global.resource.Stone.name : (global.resource['Plywood'] ? global.resource.Plywood.name : loc('resource_Plywood_name'));
    let cost = global.race['kindling_kindred'] ? 200 : 10
    return loc('resource_modal_crate_construct_desc',[cost,material,crateValue()]);
}

function buildContainerLabel(){
    return loc('resource_modal_container_construct_desc',[125,containerValue()]);
}

function buildCrate(){
    let keyMutipler = keyMultiplier();
    let material = global.race['kindling_kindred'] ? 'Stone' : 'Plywood';
    let cost = global.race['kindling_kindred'] ? 200 : 10;
    if (keyMutipler + global.resource.Crates.amount > global.resource.Crates.max){
        keyMutipler = global.resource.Crates.max - global.resource.Crates.amount;
    }
    if (global.resource[material].amount < cost * keyMutipler){
        keyMutipler = Math.floor(global.resource[material].amount / cost);
    }
    if (global.resource[material].amount >= (cost * keyMutipler) && global.resource.Crates.amount < global.resource.Crates.max){
        modRes(material,-(cost * keyMutipler));
        global.resource.Crates.amount += keyMutipler;
    }
}

function buildContainer(){
    let keyMutipler = keyMultiplier();
    if (keyMutipler + global.resource.Containers.amount > global.resource.Containers.max){
        keyMutipler = global.resource.Containers.max - global.resource.Containers.amount;
    }
    if (global.resource['Steel'].amount < 125 * keyMutipler){
        keyMutipler = Math.floor(global.resource['Steel'].amount / 125);
    }
    if (global.resource['Steel'].amount >= (125 * keyMutipler) && global.resource.Containers.amount < global.resource.Containers.max){
        modRes('Steel',-(125 * keyMutipler));
        global.resource.Containers.amount += keyMutipler;
    }
}

function drawModal(name,color){
    $('#modalBox').append($('<p id="modalBoxTitle" class="has-text-warning modalTitle">{{ name }} - {{ amount | size }}/{{ max | size }}</p>'));
    
    let body = $('<div class="modalBody crateModal"></div>');
    $('#modalBox').append(body);

    if (name === 'Food'){
        let egg = easterEgg(7,10);
        if (egg.length > 0){
            $('#modalBoxTitle').prepend(egg);
        }
    }
    
    let crates = $('<div id="modalCrates" class="crates"></div>');
    body.append(crates);
    
    crates.append($(`<div class="crateHead"><span>${loc('resource_modal_crate_owned')} {{ crates.amount }}/{{ crates.max }}</span><span>${loc('resource_modal_crate_assigned')} {{ res.crates }}</span></div>`));
    
    let buildCr = $(`<b-tooltip :label="buildCrateLabel()" position="is-bottom" animated multilined><button class="button" @click="buildCrate()">${loc('resource_modal_crate_construct')}</button></b-tooltip>`);
    let removeCr = $(`<b-tooltip :label="removeCrateLabel()" position="is-bottom" animated><button class="button" @click="subCrate('${name}')">${loc('resource_modal_crate_unassign')}</button></b-tooltip>`);
    let addCr = $(`<b-tooltip :label="addCrateLabel()" position="is-bottom" animated><button class="button" @click="addCrate('${name}')">${loc('resource_modal_crate_assign')}</button></b-tooltip>`);
    
    crates.append(buildCr);
    crates.append(removeCr);
    crates.append(addCr);
    
    vBind({
        el: `#modalCrates`,
        data: { 
            crates: global['resource']['Crates'],
            res: global['resource'][name],
        },
        methods: {
            buildCrateLabel(){
                return buildCrateLabel();
            },
            removeCrateLabel(){
                let cap = crateValue();
                return loc('resource_modal_crate_unassign_desc',[cap]);
            },
            addCrateLabel(){
                let cap = crateValue();
                return loc('resource_modal_crate_assign_desc',[cap]);
            },
            buildCrate(){
                buildCrate();
            },
            subCrate(res){
                unassignCrate(res);
            },
            addCrate(res){
                assignCrate(res);
            }
        }
    });
    
    if (global.city['warehouse'] && global.city['warehouse'].count > 0){
        let containers = $('<div id="modalContainers" class="crates divide"></div>');
        body.append(containers);
        
        containers.append($(`<div class="crateHead"><span>${loc('resource_modal_container_owned')} {{ containers.amount }}/{{ containers.max }}</span><span>${loc('resource_modal_container_assigned')} {{ res.containers }}</span></div>`));
        
        let position = global.race['terrifying'] ? 'is-top' : 'is-bottom';

        let buildCon = $(`<b-tooltip :label="buildContainerLabel()" position="${position}" animated multilined><button class="button" @click="buildContainer()">${loc('resource_modal_container_construct')}</button></b-tooltip>`);
        let removeCon = $(`<b-tooltip :label="removeContainerLabel()" position="${position}" animated><button class="button" @click="removeContainer('${name}')">${loc('resource_modal_container_unassign')}</button></b-tooltip>`);
        let addCon = $(`<b-tooltip :label="addContainerLabel()" position="${position}" animated><button class="button" @click="addContainer('${name}')">${loc('resource_modal_container_assign')}</button></b-tooltip>`);
        
        containers.append(buildCon);
        containers.append(removeCon);
        containers.append(addCon);
        
        vBind({
            el: `#modalContainers`,
            data: { 
                containers: global['resource']['Containers'],
                res: global['resource'][name],
            },
            methods: {
                buildContainerLabel(){
                    return buildContainerLabel();
                },
                removeContainerLabel(){
                    let cap = containerValue();
                    return loc('resource_modal_container_unassign_desc',[cap]);
                },
                addContainerLabel(){
                    let cap = containerValue();
                    return loc('resource_modal_container_assign_desc',[cap]);
                },
                buildContainer(){
                    buildContainer();
                },
                removeContainer(res){
                    unassignContainer(res);
                },
                addContainer(res){
                    assignContainer(res);
                }
            }
        });
    }

    vBind({
        el: `#modalBoxTitle`,
        data: global['resource'][name], 
        filters: {
            size: function (value){
                return sizeApproximation(value,0);
            },
            diffSize: function (value){
                return sizeApproximation(value,2);
            }
        }
    });
}

export function crateValue(){
    let create_value = global.tech['container'] && global.tech['container'] >= 2 ? 500 : 350;
    if (global.tech['container'] && global.tech['container'] >= 4){
        create_value += global.tech['container'] >= 5 ? 500 : 250;
    }
    if (global.tech['container'] && global.tech['container'] >= 6){
        create_value += global.tech['container'] >= 7 ? 1200 : 500;
    }
    if (global.tech['container'] && global.tech['container'] >= 8){
        create_value += 4000;
    }
    if (global.race['pack_rat']){
        create_value *= 1 + (traits.pack_rat.vars[0] / 100);
    }
    create_value *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole.l * 0.05) : 1;
    return Math.round(spatialReasoning(create_value));
}

export function containerValue(){
    let container_value = global.tech['steel_container'] && global.tech['steel_container'] >= 3 ? 1200 : 800;
    if (global.tech['steel_container'] && global.tech['steel_container'] >= 4){
        container_value += global.tech['steel_container'] >= 5 ? 1000 : 400;
    }
    if (global.tech['steel_container'] && global.tech['steel_container'] >= 6){
        container_value += global.tech['steel_container'] >= 7 ? 7500 : 1000;
    }
    if (global.tech['steel_container'] && global.tech['steel_container'] >= 8){
        container_value += 8000;
    }
    if (global.race['pack_rat']){
        container_value *= 1 + (traits.pack_rat.vars[0] / 100);
    }
    container_value *= global.stats.achieve['blackhole'] ? 1 + (global.stats.achieve.blackhole.l * 0.05) : 1;
    return Math.round(spatialReasoning(container_value));
}

function initMarket(){
    let market = $(`<div id="market-qty" class="market-header"><h2 class="is-sr-only">${loc('resource_market')}</h2></div>`);
    clearElement($('#market'));
    $('#market').append(market);
    loadMarket();
}

function initStorage(){
    let store = $(`<div id="createHead" class="storage-header"><h2 class="is-sr-only">${loc('tab_storage')}</h2></div>`);
    clearElement($('#resStorage'));
    $('#resStorage').append(store);
    
    if (global.resource['Crates'] && global.resource['Containers']){
        store.append($(`<b-tooltip :label="buildCrateDesc()" position="is-bottom" class="crate" animated multilined><button :aria-label="buildCrateDesc()" v-show="cr.display" class="button" @click="crate">${loc('resource_modal_crate_construct')}</button></b-tooltip>`));
        store.append($(`<b-tooltip :label="buildContainerDesc()" position="is-bottom" class="container" animated multilined><button :aria-label="buildContainerDesc()" v-show="cn.display" class="button" @click="container">${loc('resource_modal_container_construct')}</button></b-tooltip>`));

        vBind({
            el: '#createHead',
            data: {
                cr: global.resource.Crates,
                cn: global.resource.Containers
            },
            methods: {
                crate(){
                    buildCrate();
                },
                container(){
                    buildContainer();
                },
                buildCrateDesc(){
                    return buildCrateLabel();
                },
                buildContainerDesc(){
                    return buildContainerLabel();
                },
            }
        });
    }
}

export function loadMarket(){
    let market = $('#market-qty');
    clearElement(market);

    if (!global.race['no_trade']){
        market.append($(`<h3 class="is-sr-only">${loc('resource_trade_qty')}</h3>`));
        market.append($(`<b-field class="market"><span class="button has-text-danger" role="button" @click="less">-</span><b-numberinput :input="val()" min="1" :max="limit()" v-model="qty" :controls="false"></b-numberinput><span class="button has-text-success" role="button" @click="more">+</span></b-field>`));
    }

    vBind({
        el: `#market-qty`,
        data: global.city.market,
        methods: {
            val(){
                if (global.city.market.qty < 1){
                    global.city.market.qty = 1;
                }
                else if (global.city.market.qty > tradeMax()){
                    global.city.market.qty = tradeMax();
                }
            },
            limit(){
                return tradeMax();
            },
            less(){
                global.city.market.qty -= keyMultiplier();
            },
            more(){
                global.city.market.qty += keyMultiplier();
            }
        }
    });
}

function tradeMax(){
    if (global.tech['currency'] >= 6){
        return 1000000;
    }
    else if (global.tech['currency'] >= 4){
        return 5000;
    }
    else {
        return 100;
    }
}

function initEjector(){
    clearElement($('#resEjector'));
    if (global.interstellar['mass_ejector']){
        let ejector = $(`<div id="eject" class="market-item"><h3 class="res has-text-warning">${loc('interstellar_mass_ejector_vol')}</h3></div>`);
        $('#resEjector').append(ejector);

        let eject = $(`<span class="trade"></span>`);
        ejector.append(eject);

        eject.append($(`<span>{{ total }} / {{ on | max }}</span><span class="mass">${loc('interstellar_mass_ejector_mass')}: {{ mass | approx }} kt/s</span>`));

        vBind({
            el: `#eject`,
            data: global.interstellar.mass_ejector,
            filters: {
                max(num){
                    return num * 1000;
                },
                approx(tons){
                    return sizeApproximation(tons,2);
                }
            }
        });
    }
}

function loadEjector(name,color){
    if (atomic_mass[name] && global.interstellar['mass_ejector']){
        let ejector = $(`<div id="eject${name}" class="market-item" v-show="r.display"><h3 class="res has-text-${color}">${global.resource[name].name}</h3></div>`);
        $('#resEjector').append(ejector);

        let res = $(`<span class="trade"></span>`);
        ejector.append(res);

        res.append($(`<span role="button" aria-label="eject less ${loc('resource_'+name+'_name')}" class="sub has-text-danger" @click="ejectLess('${name}')"><span>&laquo;</span></span>`));
        res.append($(`<span class="current">{{ e.${name} }}</span>`));
        res.append($(`<span role="button" aria-label="eject more ${loc('resource_'+name+'_name')}" class="add has-text-success" @click="ejectMore('${name}')"><span>&raquo;</span></span>`));

        res.append($(`<span class="mass">${loc('interstellar_mass_ejector_per')}: <span class="has-text-warning">${atomic_mass[name]}</span> kt</span>`));

        vBind({
            el: `#eject${name}`,
            data: {
                r: global.resource[name],
                e: global.interstellar.mass_ejector
            },
            methods: {
                ejectMore(r){
                    let keyMutipler = keyMultiplier();
                    if (keyMutipler + global.interstellar.mass_ejector.total > global.interstellar.mass_ejector.on * 1000){
                        keyMutipler = global.interstellar.mass_ejector.on * 1000 - global.interstellar.mass_ejector.total;
                    }
                    global.interstellar.mass_ejector[r] += keyMutipler;
                    global.interstellar.mass_ejector.total += keyMutipler;
                },
                ejectLess(r){
                    let keyMutipler = keyMultiplier();
                    if (keyMutipler > global.interstellar.mass_ejector[r]){
                        keyMutipler = global.interstellar.mass_ejector[r];
                    }
                    if (global.interstellar.mass_ejector[r] > 0){
                        global.interstellar.mass_ejector[r] -= keyMutipler;
                        global.interstellar.mass_ejector.total -= keyMutipler;
                    }
                },
            }
        });
    }
}

export function spatialReasoning(value){
    let plasmids = global.race.universe === 'antimatter' ? global.race.Plasmid.anti : global.race.Plasmid.count;
    if (global.race['no_plasmid']){
        plasmids = global.race.p_mutation > plasmids ? plasmids : global.race.p_mutation;
    }
    if (global.genes['store'] && global.genes['store'] >= 4){
        plasmids += global.race.Phage.count;
    }
    if (global.genes['store']){
        let divisor = global.genes.store >= 2 ? (global.genes.store >= 3 ? 1250 : 1666) : 2500;
        if (global.race.universe === 'antimatter'){
            divisor *= 2;
        }
        if (global.genes['bleed'] && global.genes['bleed'] >= 3){
            plasmids += global.race.universe === 'antimatter' ? global.race.Plasmid.count / 5 : global.race.Plasmid.anti / 10;
        }
        value *= 1 + (plasmids / divisor);
    }
    if (global.race.universe === 'standard'){
        let de = global.race.Dark.count;
        if (global.race.Harmony.count > 0){
            de *= 1 + (global.race.Harmony.count * 0.0001);
        }
        value *= 1 + (de / 200);
    }
    if (global.race.universe === 'antimatter' && global.city['temple'] && global.city['temple'].count){
        let temple = 0.06;
        if (global.genes['ancients'] && global.genes['ancients'] >= 2 && global.civic.priest.display){
            let priest = global.genes['ancients'] >= 4 ? 0.0012 : 0.0008;
            temple += priest * global.civic.priest.workers;
        }
        value *= 1 + (global.city.temple.count * temple);
    }
    return Math.round(value);
}

export function plasmidBonus(type){
    let standard = 0;
    let anti = 0;    
    if (global.race.universe !== 'antimatter' || global.genes['bleed']){
        let plasmids = global.race['no_plasmid'] ? global.race.p_mutation : global.race.Plasmid.count;
        if (plasmids > global.race.Plasmid.count){
            plasmids = global.race.Plasmid.count;
        }
        if (global.race.universe === 'antimatter' && global.genes['bleed']){
            plasmids *= 0.025
        }
        if (global.race['decayed']){
            plasmids -= Math.round((global.stats.days - global.race.decayed) / (300 + global.race.gene_fortify * 6));
        }
        let p_cap = 250 + global.race.Phage.count;
        if (plasmids > p_cap){
            standard = (+((Math.log(p_cap + 50) - 3.91202)).toFixed(5) / 2.888) + ((Math.log(plasmids + 1 - p_cap) / Math.LN2 / 250));
        }
        else if (plasmids < 0){
            standard = 0;
        }
        else {
            standard = +((Math.log(plasmids + 50) - 3.91202)).toFixed(5) / 2.888;
        }

        if (global.city['temple'] && global.city['temple'].count && !global.race['no_plasmid'] && global.race.universe !== 'antimatter'){
            let temple_bonus = global.tech['anthropology'] && global.tech['anthropology'] >= 1 ? 0.08 : 0.05;
            if (global.tech['fanaticism'] && global.tech['fanaticism'] >= 2){
                temple_bonus += global.civic.professor.workers * 0.002;
            }
            if (global.genes['ancients'] && global.genes['ancients'] >= 2 && global.civic.priest.display){
                let priest_bonus = global.genes['ancients'] >= 4 ? 0.0015 : 0.001;
                temple_bonus += priest_bonus * global.civic.priest.workers;
            }
            if (global.race['spiritual']){
                temple_bonus *= 1 + (traits.spiritual.vars[0] / 100);
            }
            if (global.civic.govern.type === 'theocracy'){
                temple_bonus *= 1.12;
            }
            standard *= 1 + (global.city.temple.count * temple_bonus);
        }
    }

    if (global.race.universe === 'antimatter' || (global.genes['bleed'] && global.genes['bleed'] >= 2)){
        let plasmids = global.race.Plasmid.anti;
        if (plasmids > global.race.Plasmid.anti){
            plasmids = global.race.Plasmid.anti;
        }
        if (global.race.universe !== 'antimatter' && global.genes['bleed'] && global.genes['bleed'] >= 2){
            plasmids *= 0.25
        }
        if (global.race['decayed']){
            plasmids -= Math.round((global.stats.days - global.race.decayed) / (300 + global.race.gene_fortify * 6));
        }
        let p_cap = 250 + global.race.Phage.count;
        if (plasmids > p_cap){
            anti = (+((Math.log(p_cap + 50) - 3.91202)).toFixed(5) / 2.888) + ((Math.log(plasmids + 1 - p_cap) / Math.LN2 / 250));
        }
        else if (plasmids < 0){
            anti = 0;
        }
        else {
            anti = +((Math.log(plasmids + 50) - 3.91202)).toFixed(5) / 2.888;
        }
        anti /= 3;
    }

    if (type && type === 'plasmid'){
        return standard;
    }
    else if (type && type === 'antiplasmid'){
        return anti;
    }

    let final = (1 + standard) * (1 + anti);
    return final - 1;
}
