var bzbzOption; //补助标准的<option>，来自后台
$.extend($.validator.defaults, {
    ignore: ""
});

function showContentCermitic(data, type, full, meta) {
    return getterMomoCanOrNot(data, 15, false, meta);
}

function anatomyBehaviours() {
    var closeM = $('.modal-backdrop');
    if (closeM.length > 0) {
        closeM.each(function () {
            $(this).remove();
        })

    }
}

/**
 * 初始化
 */
var operationAccountNameByProvince = [
    '', '【运营编辑】华东片区专区运营', '【运营编辑】江苏本地专区运营', '【运营编辑】上海本地专区运营 ', '【运营编辑】安徽本地专区运营 ', '【运营编辑】浙江本地专区运营 ',
    '【运营编辑】江西本地专区运营 ', '【运营编辑】华南片区专区运营 ', '【运营编辑】广东本地专区运营 ', '【运营编辑】广西本地专区运营', '【运营编辑】湖南本地专区运营 ',
    '【运营编辑】海南本地专区运营 ', '【运营编辑】福建本地专区运营 ', '【运营编辑】华北片区专区运营 ', '【运营编辑】山东本地专区运营 ', '【运营编辑】河北本地专区运营 ',
    '【运营编辑】北京本地专区运营 ', '【运营编辑】天津本地专区运营 ', '【运营编辑】东北片区专区运营 ', '【运营编辑】辽宁本地专区运营', '【运营编辑】吉林本地专区运营 ',
    '【运营编辑】黑龙江本地专区运营', '【运营编辑】内蒙古本地专区运营', '【运营编辑】西北片区专区运营 ', '【运营编辑】陕西本地专区运营', '【运营编辑】甘肃本地专区运营 ',
    '【运营编辑】宁夏本地专区运营', '【运营编辑】青海本地专区运营', '【运营编辑】西南片区专区运营 ', '【运营编辑】四川本地专区运营 ', '【运营编辑】云南本地专区运营',
    '【运营编辑】重庆本地专区运营 ', '【运营编辑】贵州本地专区运营 ', '【运营编辑】西藏本地专区运营', '【运营编辑】湖北本地专区运营', '【运营编辑】新疆本地专区运营',
    '【运营编辑】山西本地专区运营', '【运营编辑】河南本地专区运营 ',
];
var safeOrder = {
    init: function () {
        var currentTab = nowJSP();
        safeOrder.initProperties();
        safeOrder.initButton();
        orderComm.initTree_pro(safeOrder.parentDiv);
        //			ptOrder.initChange();
        //获取字典值
        safeOrder.initconfucius();

        safeOrder.initFocusout();
        orderComm.initDateTimeKJ($(".datetimeKJ", currentTab), "yyyy-mm-dd hh:mm:ss"); //初始化时间控件
        safeOrder.handleValidation();

    },
    initconfucius: function () {
        var currentTab = nowJSP();
        var paramAllGet = safeOrder.confuciusGot();
        var param = paramAllGet.brife.join(',');
        if (!param) return false;
        var paramArr = paramAllGet.moreDetail;
        var paramArrLen = paramArr.length;
        $.ajax({
            url: 'dictionary!findTypeNameByAttrno.action',
            type: 'POST',
            data: {
                ids: param
            },
            success: function (res) {
                if (!res || !res[0]) {
                    msgAlert('未能获取到字典值');
                    return false;
                }
                for (var i = 0; i < paramArrLen; i++) {
                    if (!paramArr[i] || !paramArr[i].id || !paramArr[i].renderInelement || !paramArr[i].parentNode) {
                        break;
                    }
                    var idNow = paramArr[i].id;
                    var renderInelementNow = paramArr[i].renderInelement;
                    var parentNodeNow = paramArr[i].parentNode;
                    var setValueNow = paramArr[i].setValue;
                    if (!idNow || !renderInelementNow || !parentNodeNow) {
                        break;
                    }
                    var resNow = res[0][idNow];
                    if (resNow) {
                        var htmlNow = '';
                        for (var j = 0; j < resNow.length; j++) {
                            if (resNow[j] && resNow[j].DESCRIPTION) {
                                if (renderInelementNow === 'option') {
                                    htmlNow = htmlNow + '<option value="' + resNow[j].DESCRIPTION + '">' + resNow[j].DESCRIPTION + '</option>';
                                }
                            }
                        }
                        if (renderInelementNow === 'option') {
                            $(parentNodeNow, currentTab).html(htmlNow);
                        }
                    }
                }
            },
            error: function (err) {
                msgAlert('未能成功获取到字典值')
            }

        })
    },
    confuciusGot: function () {
        var currentTab = nowJSP();
        var nodeFind = currentTab.find('.portlet');
        var dateTime = nodeFind.attr('data-time');
        var key = nodeFind.attr('data-key');
        return {
            brife: [],
            moreDetail: [{
                id: '',
                parentNode: '#',
                renderInelement: 'option'
            }, ]
        }
    },
    elementChoiceOne: {

    },
    ifNeedDoThat: function () {
        var currentTab = nowJSP();
        var dateKey = currentTab.find('.portlet').attr('data-time')
        var nowKey = hrefCome[handleList[dateKey].key];
        var processInstanceId = nowKey.processInstanceId;
        var orderId_prefix = nowKey.orderId_prefix;
        var orderType = nowKey.orderType;
        var taskname = nowKey.taskname;
        var assignee = nowKey.assignee;
        var startUserId = nowKey.startUserId;
        var id = nowKey.id;
        var innerIdAcc = id === OPERATION_ACCOUNT_OPENNING ||
            id === FOURTH_A_ACCOUNT ||
            id === DATA_PLATFORM_OP ||
            id === OPERATION_Role_CHANGE ||
            id === DATA_Role_CHANGE ||
            id === LEGO_Role_CHANGE ||
            id === LEGO_GIVE_ACCOUNT;
        if (orderId_prefix === 'safe' && innerIdAcc) {
            safeOrder.whatAdvisary({
                handThislist: nowFrom,
                fascinateCan: currentTab,
                url: ACT_URL + "/act/orderManage/findOperateUserTemp",
                assignee: assignee
            });
        }
    },
    whatAdvisary: function (obj) {
        // {handThislist,fascinateCan,url,assignee}
        var handThislist = obj.handThislist;
        var fascinateCan = obj.fascinateCan;
        var url = obj.url;
        var assignee = obj.assignee;
        var whatNeed = '';
        var id = handThislist.id;
        var isUsetask1 = handThislist.taskDefinitionKey;
        var opacc = handThislist.opacc;
        var processInstanceId = handThislist.processInstanceId;
        var taskname = handThislist.taskname;
        var urlList = {};
        var urlListB = {};
        var canDoNextAfterThis = false;
        var urlListType = '';
        switch (id) {
            case OPERATION_ACCOUNT_OPENNING:
                whatNeed = safeOrder.OperationAccountNeed(opacc);
                urlList = {
                    del: ACT_URL + '/act/orderManage/deleteOperateUserTemp',
                    add: ACT_URL + '/act/orderManage/saveOperateUserTemp',
                    edit: ACT_URL + '/act/orderManage/saveOperateUserTemp',
                    doTable: ACT_URL + '/act/orderManage/findOperateUserTemp',
                    query: ACT_URL + '/act/orderManage/findOperatePager',
                    system: ACT_URL + '/act/orderManage/getAllOperateSystem',
                    imFile: 'import!importMaintainProcess.action',
                    errorFile: 'user!downloadErrorInfo.action',
                    templateFile: FILE_ACT_URL + '/account/processManage/exportMaintainPorcessModel',
                    turnOut: FILE_ACT_URL + '/act/orderManage/exportMaintainInOrder',
                    turnIn: 'import!importMaintainProcess.action',
                    type: 'operation',
                    department: opacc,
                };
                if (opacc) {
                    if (isUsetask1 === 'usertask1' || isUsetask1 === '') {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, [{
                            value: opacc,
                            name: 'belongDep'
                        }, {
                            name: 'createPerson',
                            value: userName
                        }]);
                    }
                } else {
                    //OPACCADMIN roleIds
                    var opO = ',' + roleIds + ',';
                    if (opO.indexOf(OPACCADMIN) > -1 && taskname.indexOf('实施') > -1) {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, true);
                    } else {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, false);
                    }
                }
                break;
            case FOURTH_A_ACCOUNT:
                $('textarea[name=safe1_describe]', fascinateCan).attr('rows', 2);
                whatNeed = safeOrder.FourthAccountNeed;
                urlList = {
                    del: ACT_URL + '/account/processManage/delete4aAccountProcess',
                    add: ACT_URL + '/account/processManage/save4aAccountProcess',
                    edit: ACT_URL + '/account/processManage/save4aAccountProcess',
                    doTable: ACT_URL + '/account/processManage/find4aApplyPager',
                    query: '',
                    system: '',
                    imFile: 'import!import4aAccount.action',
                    errorFile: 'import!downloadErrorInfo.action',
                    templateFile: FILE_ACT_URL + '/account/processManage/export4aAccountModel',
                    turnOut: FILE_ACT_URL + '/account/processManage/export4aAccountData',
                    turnIn: 'import!import4aAccount.action',
                    type: 'fourthA',
                    typeB: '4a',
                    name: '账号申请信息'
                };
                urlListB = {
                    del: ACT_URL + '/account/processManage/delete4aAccountProcess',
                    add: ACT_URL + '/account/processManage/save4aAccountRight',
                    edit: ACT_URL + '/account/processManage/save4aAccountRight',
                    doTable: ACT_URL + '/account/processManage/find4aRightPager',
                    query: '',
                    system: '',
                    imFile: 'import!import4aRight.action',
                    errorFile: 'import!downloadErrorInfo.action',
                    templateFile: FILE_ACT_URL + '/account/processManage/export4aRightModel',
                    turnOut: FILE_ACT_URL + '/account/processManage/export4aRightData',
                    turnIn: 'import!import4aRight.action',
                    type: 'fourthA',
                    typeB: 'right',
                    spacialClass: 'aa',
                    name: '权限申请信息'
                };
                if (opacc) {
                    if (isUsetask1 === 'usertask1' || isUsetask1 === '') {
                        safeOrder.renderAndTableFormNow(safeOrder.FourthAccountNeedB(), fascinateCan, urlListB, handThislist, true, false, false, );
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, false, );

                    }
                } else {
                    safeOrder.renderAndTableFormNow(safeOrder.FourthAccountNeedB(), fascinateCan, urlListB, handThislist, true, false, false, );
                    safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, false, );
                }
                break;
            case DATA_PLATFORM_OP:
                whatNeed = safeOrder.DataPlatformNeed(opacc);
                urlList = {
                    del: ACT_URL + '/act/orderManage/deleteOperateUserTemp',
                    add: ACT_URL + '/act/orderManage/saveDataUserTemp',
                    edit: ACT_URL + '/act/orderManage/saveDataUserTemp',
                    doTable: ACT_URL + '/act/orderManage/findOperateUserTemp',
                    query: ACT_URL + '/act/orderManage/findOperatePager',
                    system: ACT_URL + '/act/orderManage/getAllOperateSystem',
                    imFile: 'import!importRecordData.action',
                    errorFile: 'user!downloadErrorInfo.action',
                    templateFile: FILE_ACT_URL + '/account/processManage/exportDataModel',
                    turnOut: FILE_ACT_URL + '/act/orderManage/exportDataPlatformAccount',
                    turnIn: 'import!importRecordData.action',
                    type: 'data',
                    department: opacc,
                };
                if (opacc) {
                    if (isUsetask1 === 'usertask1' || isUsetask1 === '') {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, [{
                            value: opacc,
                            name: 'belongDep'
                        }, {
                            name: 'createPerson',
                            value: userName
                        }]);
                    }
                } else {
                    var opO = ',' + roleIds + ',';
                    if (opO.indexOf(DAPLACCADMIN) > -1 && taskname.indexOf('实施') > -1) {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, true);
                    } else {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true);
                    }
                }
                break;
            case LEGO_GIVE_ACCOUNT:
                whatNeed = safeOrder.LegoPlatformNeed(opacc);
                urlList = {
                    del: ACT_URL + '/act/orderManage/deleteOperateUserTemp',
                    add: ACT_URL + '/act/orderManage/saveDataUserTemp',
                    edit: ACT_URL + '/act/orderManage/saveDataUserTemp',
                    doTable: ACT_URL + '/act/orderManage/findOperateUserTemp',
                    query: ACT_URL + '/act/orderManage/findOperatePager',
                    system: ACT_URL + '/act/orderManage/getAllOperateSystem',
                    imFile: 'import!importRecordData.action',
                    errorFile: 'user!downloadErrorInfo.action',
                    templateFile: FILE_ACT_URL + '/account/processManage/exportDataModel',
                    type: 'lego',
                    department: opacc,
                };
                if (opacc) {
                    if (isUsetask1 === 'usertask1' || isUsetask1 === '') {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, [{
                            value: opacc,
                            name: 'belongDep'
                        }, {
                            name: 'createPerson',
                            value: userName
                        }]);
                    }
                } else {
                    var opO = ',' + roleIds + ',';
                    if (opO.indexOf(LEGOGIVENADMIN) > -1 && taskname.indexOf('实施') > -1) {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, false, true);
                    } else {
                        safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true);
                    }
                }
                break;
            case OPERATION_Role_CHANGE:
                canDoNextAfterThis = true;
                urlListType = 'operation';
                break;
            case DATA_Role_CHANGE:
                canDoNextAfterThis = true;
                urlListType = 'data';
                break;
            case LEGO_Role_CHANGE:
                canDoNextAfterThis = true;
                urlListType = 'lego';
                break;
            default:
                break;
        }
        var ifCanEdit = isUsetask1 === 'usertask1' || isUsetask1 === '';
        if (canDoNextAfterThis && urlListType) {
            urlList = {
                system: ACT_URL + '/act/orderManage/getAllOperateSystem',
                type: urlListType,
                query: ACT_URL + '/act/orderManage/findOperatePager',
                depart: opacc,
            }
            safeOrder.roleChangeRender(safeOrder.RolehangeNeed(urlList.type), fascinateCan, urlList, handThislist, ifCanEdit);

        }
    },
    getTypeIfChangeRight: function () {
        var currentTab = nowJSP();
        var dateKey = currentTab.find('.portlet').attr('data-time')
        var nowKey = hrefCome[handleList[dateKey].key];
        var usetaskNum = nowKey.taskDefinitionKey;
        var id = nowKey.id;
        if (usetaskNum === '' || usetaskNum === 'usertask1') {
            switch (id) {
                case OPERATION_Role_CHANGE:
                    return 'operation';
                case DATA_Role_CHANGE:
                    return 'data';
                case LEGO_Role_CHANGE:
                    return 'lego';
            }
        }
    },
    roleChangeRender: function (whatNeed, fascinateCan, urlList, handThislist, canEditD) {
        var timeIndex = fascinateCan.find('.portlet').attr('data-time');
        var isDisabled = canEditD ? '' : 'disabled';
        const formElement = '<div class="form-group list-group col-md-12"><h2 class="line-title-form">申请/变更信息填写</h2></div>' +
            '<div class="' + timeIndex + '_canner_change">' + '<div class="form_new_' + timeIndex + '"></div>' +
            '<div class="form-group col-md-12" style="margin-top:15px;margin-bottom:15px;"><label class="control-label col-md-2">权限选择</label>' +
            '<div class="' + timeIndex + '_jurisdiction limits_of_authority col-md-10" style="padding-left:0px;">' +
            '<div class="col-md-5 limits_of_authority_inner existing_authority"><div class="limits_of_authority-title"><div class="limits_of_authority-title-left"> <input type="checkbox" class="" value="" ' + isDisabled + '> <span class="num">0</span>项 </div><div class="limits_of_authority-title-right">具备的权限</div></div><ul class="innner"></ul></div>' +
            '<div class="col-md-2 limits_of_authority_center"><span class="btn blue remove authority_doing" ' + isDisabled + '>></span><span class="btn blue add authority_doing" ' + isDisabled + '><</span></div>' +
            '<div class="col-md-5 limits_of_authority_inner lacking_authority"><div class="limits_of_authority-title"><div class="limits_of_authority-title-left"> <input type="checkbox" class="" value="" ' + isDisabled + '> <span class="num">0</span>项 </div><div class="limits_of_authority-title-right">不具备的权限</div></div><ul class="innner"></ul><div>' +
            '</div></div>';

        var cannerPP = fascinateCan.find('textarea[name=safe1_secretDescribe]').parent().parent();
        cannerPP.after(formElement);

        var buffTheMagic = $('.' + timeIndex + '_canner_change .form_new_' + timeIndex, fascinateCan);

        var whatNeedLen = whatNeed.length
        var formHtml = '';
        var valueSet = [];
        var ruleNeed = [];
        var timeInput = {};
        var spacialInputAfterSys = []; //部门和角色在系统选定后
        for (var i = 0; i < whatNeedLen; i++) {
            var nowIk = whatNeed[i];
            formHtml += safeOrder.formElementRender(nowIk, !canEditD, true);
            valueSet.push({
                name: nowIk.name,
                nameIndex: nowIk.indexName,
                nochange: nowIk.mayNo === 'true'
            });
            if (nowIk.required && nowIk.required !== '') {
                ruleNeed.push({
                    name: nowIk.name,
                    rule: nowIk.required,
                    title: nowIk.title,
                    isNotReqire: nowIk.requiredTip === 'false',
                });
            }
            if (nowIk.element === 'inputSelect') {
                spacialInputAfterSys.push(nowIk);
            }
            if (nowIk.element === 'inputTime') {
                timeInput = nowIk;
            }
        }


        $('.' + timeIndex + '_canner_change .form_new_' + timeIndex, fascinateCan).html(formHtml);

        var thisCanner = fascinateCan.find('.portlet');
        if (canEditD) {
            $('input[name=safe1_phone]', fascinateCan).removeAttr('disabled').removeAttr('readonly');
            //时间插件
            if (timeInput) {
                var timeRightNow = orderComm.getTimeRightnow();
                orderComm.initDateTimeKJ($(".datetimeKJApplay", currentTab), "yyyy-mm-dd hh:mm:ss"); //初始化时间控件
                $('.form_' + timeInput.name, buffTheMagic).val(timeRightNow);
            }
            $('.form_dep', buffTheMagic).val(urlList.depart);
            safeOrder.systemInitAndEvent(buffTheMagic, spacialInputAfterSys, urlList, canEditD, timeIndex); //系统初始化
            orderList['permissionChange' + timeIndex] = ruleNeed;
            safeOrder.TransferEvent(thisCanner, timeIndex);
        }
        safeOrder.roleChangeFetchData(handThislist, canEditD); //获取提交的数据
    },
    roleChangeVerification: function () {
        var currentTab = nowJSP();
        var timeIndex = currentTab.find('.portlet').attr('data-time');
        //手机验证
        // var phone=$('input[name=safe1_phone]',currentTab).val();
        // if(!phone || !/^1\d{10}$/.test(phone)){
        // 	AlertMsg('请填写正确的手机号格式!');
        // 	return false;
        // }
        var ruleArr = orderList['permissionChange' + timeIndex] || [];
        for (var i = 0; i < ruleArr.length; i++) {
            if (ruleArr[i] && ruleArr[i].name && ruleArr[i].title) {
                var paramValue = $('.form_' + ruleArr[i].name, currentTab).val();
                if (!paramValue) {
                    AlertMsg('请填写' + ruleArr[i].title + '!');
                    return false;
                }
            }
        }
        return true;
    },
    roleChangeFetchData: function (handThislist, canEditD) {
        var processInstanceId = handThislist.processInstanceId;
        if (!processInstanceId) return false;
        $.ajax({
            type: 'POST',
            data: {
                processInstanceId: processInstanceId
            },
            url: ACT_URL + '/account/processManage/findRightApplyFormData',
            dataType: 'json',
            success: function (res) {
                if (res && res.datas) {
                    var dataBack = res.datas;
                    safeOrder.roleChangeSetAndGetData(dataBack, 'set', canEditD);
                }
            },
            error: function (err) {

            }
        })
    },
    roleChangeUpData: function (fun, noVerifica) {
        var ifCanGoNext = true;
        if (!noVerifica) {
            ifCanGoNext = safeOrder.roleChangeVerification();
        }
        if (!ifCanGoNext) return false;
        var data = safeOrder.roleChangeSetAndGetData('', 'get');
        if (ifCanGoNext) {
            $.ajax({
                type: 'POST',
                data: data,
                url: ACT_URL + '/account/processManage/saveRightApplyForm',
                success: function (res) {
                    if (res === 'success' || res === 'SUCCESS') {
                        if (fun && typeof fun === 'function') {
                            fun();
                        }
                    } else {
                        msgAlert('变更信息提交失败!')
                        return false;
                    }
                },
                error: function (err) {
                    msgAlert('变更信息提交失败...')
                }
            })
        }
    },
    roleChangeSetAndGetData: function (data, type, canEditDo) {
        //type 分为set和get两种
        var currentTab = nowJSP();
        var dateKey = currentTab.find('.portlet').attr('data-time')
        var processInstanceId = $("input[name='processInstanceId']", currentTab).val();
        var phoneNum = $("input[name='safe1_phone']", currentTab).val();
        var applyName = $("input[name='safe1_personName']", currentTab).val();
        var canEditD = canEditDo ? true : false;
        var getParam = safeOrder.RolehangeNeed();
        var getParamLen = getParam.length;
        var valueGot = {
            draftProcessInstanceId: processInstanceId,
            phone: phoneNum,
            applyName: applyName
        };
        for (var i = 0; i < getParamLen; i++) {
            var getParamI = getParam[i];
            var getParamIName = getParamI.name;
            var whatCallInData = getParamI.indexName;
            if (type === 'set') {
                var dataTemp = data && data[whatCallInData];
                if (data && data[whatCallInData]) {
                    if (getParamI.hidden === 'id') {
                        var dataTemp2 = dataTemp;
                        dataTemp = dataTemp ? dataTemp.split(':') : [];
                        if (dataTemp[1]) {
                            dataTemp[1] = dataTemp2.replace(dataTemp[0] + ':', '');
                        }
                    } else {
                        dataTemp = [data[whatCallInData]];
                    }
                } else {
                    dataTemp = [''];
                }
                if (getParamI.hidden === 'id') { //系统、部门、角色三个有Id
                    $('.form_' + getParamIName + '_id', currentTab).val(dataTemp[0] || '');
                    $('.form_' + getParamIName, currentTab).val(dataTemp[1] || '');
                } else {
                    $('.form_' + getParamIName, currentTab).val(dataTemp[0] || '');
                }
            } else if (type === 'get') {
                var idName = $('.form_' + getParamIName, currentTab).val();
                if (getParamI.hidden === 'id') { //系统、部门、角色三个有Id
                    var idJK = $('.form_' + getParamIName + '_id', currentTab).val();
                    if (idName) {
                        valueGot[getParamIName] = idJK + ':' + idName;
                    } else {
                        valueGot[getParamIName] = '';
                    }

                } else {
                    valueGot[getParamIName] = idName;
                }
            }
        }
        if (type === 'set') {
            var existArr = data && data.RIGHT_TEAMS ? data.RIGHT_TEAMS.split(',') : [];
            var dontHasArr = data && data.LACK_RIGHT_TEAMS ? data.LACK_RIGHT_TEAMS.split(',') : [];
            safeOrder.jurisdictionRender(existArr, dontHasArr, canEditD, currentTab, dateKey, 'fill');
            return false;
        } else if (type === 'get') { //获取获得及未获得的权限数据
            var hadRight = safeOrder.jurisdictionDataGet($('.' + dateKey + '_jurisdiction .existing_authority .innner'));
            var lackRight = safeOrder.jurisdictionDataGet($('.' + dateKey + '_jurisdiction .lacking_authority .innner'));
            valueGot.rightTeams = hadRight;
            valueGot.lackRightTeams = lackRight;
            valueGot.rightType = safeOrder.getTypeIfChangeRight();
            return valueGot;
        }
    },
    TransferEvent: function (currentTab, timeIndex) {
        currentTab.on('click', '.' + timeIndex + '_jurisdiction .authority_doing', function () {
            var fartherAway = '';
            var anfartherAway = '';
            if ($(this).hasClass('add')) {
                fartherAway = $('.' + timeIndex + '_jurisdiction .lacking_authority .innner');
                anfartherAway = $('.' + timeIndex + '_jurisdiction .existing_authority .innner');
            } else if ($(this).hasClass('remove')) {
                fartherAway = $('.' + timeIndex + '_jurisdiction .existing_authority .innner');
                anfartherAway = $('.' + timeIndex + '_jurisdiction .lacking_authority .innner');
            }
            if (fartherAway) {
                var arrChoice = [];
                var htmlChoice = '';
                fartherAway.find('input').each(function (index, ele) {
                    if ($(this).attr('checked')) {
                        var idcc = $(this).val();
                        var textcc = $(this).parents('label').text();
                        if (idcc && textcc) {
                            htmlChoice += '<li><label><input type="checkbox" value="' + idcc + '">' + textcc + '</label></li>';
                            $(this).parents('li').remove();
                        }
                    }
                })

                if (!htmlChoice) {
                    AlertMsg('没有选中的权限需要移动!');
                } else {
                    fartherAway.parent().find('.limits_of_authority-title .checked').removeClass('checked');
                    anfartherAway.prepend(htmlChoice);
                    var leftNowNum = $('.' + timeIndex + '_jurisdiction .existing_authority .innner li').length;
                    var rightNowNum = $('.' + timeIndex + '_jurisdiction .lacking_authority .innner li').length;
                    $('.' + timeIndex + '_jurisdiction .existing_authority .limits_of_authority-title-left .num').text(leftNowNum);
                    $('.' + timeIndex + '_jurisdiction .lacking_authority .limits_of_authority-title-left .num').text(rightNowNum);

                }
            }
        })
        currentTab.on('click', '.' + timeIndex + '_jurisdiction .limits_of_authority-title-left input', function () {
            var checkedNow = $(this).attr('checked');
            var myInner = $(this).parents('.limits_of_authority_inner').find('.innner input');
            var checkedAttr = '';
            if (checkedNow) {
                checkedAttr = 'checked';
            }
            myInner.each(function () {
                if (checkedAttr) {
                    $(this).attr('checked', 'checked');
                } else {
                    $(this).removeAttr('checked');
                }

            })
        })
    },
    systemInitAndEvent: function (buffTheMagic, spacialInputAfterSys, urlList, canEditD, timeIndex) {
        $.ajax({
            type: "POST",
            url: urlList.system,
            data: {
                type: urlList.type
            },
            dataType: 'json',
            success: function (result) {
                var arrSys = [];
                if (result && result.length) {
                    for (var i = 0; i < result.length; i++) {
                        arrSys.push({
                            id: result[i].SYSTEM_ID,
                            value: result[i].SYSTEM_NAME,
                        })
                    }
                }
                var sysDoBeAndAf = {
                    after: afterSystemChange,
                    before: '',
                }
                safeOrder.spacialInputHasStep(spacialInputAfterSys, buffTheMagic, 'belongSystem', arrSys, sysDoBeAndAf);
            },
            error: function (err) {

            }
        });
        //角色出现
        var roleGot = [];
        var jurisdictionArr = [];

        function afterSystemChange() {
            $.ajax({
                type: "POST",
                url: urlList.query,
                data: {
                    type: urlList.type,
                    systemId: $('.form_belongSystem_id', buffTheMagic).val(),
                    depName: '',
                },
                dataType: 'json',
                success: function (result) {
                    var arrSysDep = [];
                    roleGot = [];
                    jurisdictionArr = result.data || [];
                    if (result && result.config) {
                        var depArr = result.config.dep || [];
                        roleGot = result.config.role || [];
                        for (var iu = 0; iu < depArr.length; iu++) {
                            arrSysDep.push({
                                id: depArr[iu].DEP_ID,
                                value: depArr[iu].DEP_NAME,
                            });
                        }
                    }

                    //    				if(jurisdictionArr.length<1){
                    //    					AlertMsg('所选系统中，没有可选权限...');
                    //    				}

                    var depDoBeAndAf = {
                        before: function () {
                            return safeOrder.giveAtip([{
                                name: 'belongSystem',
                                chinese: '角色所属系统名称'
                            }], buffTheMagic)
                        },
                        after: afterDepChange,
                    };
                    console.log('======>>>>>>>>');
                    var jurArrHasnotAllK = [];
                    for (var iylh = 0; iylh < jurisdictionArr.length; iylh++) {
                        var arrTempKK = jurisdictionArr[iylh];
                        if (arrTempKK) {
                            if (arrTempKK.ID) {
                                jurArrHasnotAllK.push(arrTempKK.ID + ':' + arrTempKK.FUNCTION_AREA);
                            }
                        }
                    }
                    safeOrder.jurisdictionRender([], jurArrHasnotAllK, canEditD, buffTheMagic, timeIndex, 'fill');
                    safeOrder.spacialInputHasStep(spacialInputAfterSys, buffTheMagic, 'belongDep', arrSysDep, depDoBeAndAf);
                    $('.form_belongDep', buffTheMagic).removeAttr('readonly');
                },
                error: function (err) {

                }
            });
        }

        function afterDepChange() {
            var value = roleGot;
            var id = $('.form_belongDep_id', buffTheMagic).val();
            var arrayGive = [];
            if (id == '-1') {

            } else {
                for (var iou = 0; iou < value.length; iou++) {
                    if (id == value[iou].DEP_ID) {
                        arrayGive.push({
                            id: value[iou].ROLE_ID,
                            value: value[iou].ROLE_NAME,
                        })
                    }
                }
            }
            var roleDoBeAndAf = {
                before: function () {
                    return safeOrder.giveAtip([{
                        name: 'belongSystem',
                        chinese: '角色所属系统名称'
                    }, {
                        name: 'belongDep',
                        chinese: '角色所属部门'
                    }], buffTheMagic)
                },
                after: afterRoleChange,
            }
            // var jurArrHasnotAll=[];
            // for(var iyl=0;iyl<jurisdictionArr.length;iyl++){
            // 	var arrTempK=jurisdictionArr[iyl];
            // 	if(arrTempK){
            // 		if(arrTempK.ID){
            // 			jurArrHasnotAll.push(arrTempK.ID+':'+arrTempK.FUNCTION_AREA);
            // 		}
            // 	}
            // }
            // safeOrder.jurisdictionRender([],jurArrHasnotAll,canEditD,buffTheMagic,timeIndex,'fill');
            safeOrder.spacialInputHasStep(spacialInputAfterSys, buffTheMagic, 'roleName', arrayGive, roleDoBeAndAf);
            $('.form_roleName', buffTheMagic).removeAttr('readonly');
        }

        function afterRoleChange() {
            var jurisdictionArrTemp = jurisdictionArr;
            var id = $('.form_roleName_id', buffTheMagic).val();
            var jurArrExist = [];
            var jurArrHasnot = [];
            for (var iy = 0; iy < jurisdictionArrTemp.length; iy++) {
                var arrTemp = jurisdictionArrTemp[iy];
                if (arrTemp) {
                    if (arrTemp.roleData) {
                        if (id > 0) {
                            if (arrTemp.roleData[id] == '1') {
                                jurArrExist.push(arrTemp.ID + ':' + arrTemp.FUNCTION_AREA);
                            } else {
                                jurArrHasnot.push(arrTemp.ID + ':' + arrTemp.FUNCTION_AREA);
                            }
                        } else {
                            jurArrHasnot.push(arrTemp.ID + ':' + arrTemp.FUNCTION_AREA);
                        }

                    }
                }
            }
            safeOrder.jurisdictionRender(jurArrExist, jurArrHasnot, canEditD, buffTheMagic, timeIndex, 'fill');
        }
    },
    giveAtip: function (nameInForm, buffTheMagic) {
        //nameInForm=[{name:'',chinese:''}];
        if (!nameInForm) return false;
        for (var i = 0; i < nameInForm.length; i++) {
            if (nameInForm[i] && nameInForm[i].name && nameInForm[i].chinese) {
                var thatName = $('.form_' + nameInForm[i].name, buffTheMagic).val();
                if (!thatName) {
                    AlertMsg('请先填写' + nameInForm[i].chinese + '!');
                    return false;
                }
            }
        }
        return true;
    },
    jurisdictionDataGet: function (firstParent) {
        if (!firstParent) return false;
        var allInput = firstParent.find('input');
        var valueArr = [];
        allInput.each(function () {
            var thisName = $(this).parents('label').text();
            var thisId = $(this).val();
            valueArr.push(thisId + ':' + thisName);
        })
        return valueArr.join(',');
    },
    jurisdictionRender: function (existArr, dontHasArr, canEditD, buffTheMagic, timeIndex, type) {
        if (!existArr || !dontHasArr) return false;
        if (type === 'fill') {
            var existArrHtml = safeOrder.jurisdictionHtmlGet(existArr, canEditD);
            var dontHasArrHtml = safeOrder.jurisdictionHtmlGet(dontHasArr, canEditD);
            $('.' + timeIndex + '_jurisdiction .existing_authority .innner').html(existArrHtml);
            $('.' + timeIndex + '_jurisdiction .lacking_authority .innner').html(dontHasArrHtml);
            $('.' + timeIndex + '_jurisdiction .existing_authority .limits_of_authority-title-left>span').text(existArr.length);
            $('.' + timeIndex + '_jurisdiction .lacking_authority .limits_of_authority-title-left>span').text(dontHasArr.length);
        } else {
            $('.' + timeIndex + '_jurisdiction .existing_authority .innner').html('');
            $('.' + timeIndex + '_jurisdiction .lacking_authority .innner').html('');
            $('.' + timeIndex + '_jurisdiction .existing_authority .limits_of_authority-title-left>span').text('0');
            $('.' + timeIndex + '_jurisdiction .lacking_authority .limits_of_authority-title-left>span').text('0');
        }

    },
    jurisdictionHtmlGet: function (arr, canEditD) {
        var htmlHJ = '';
        for (var i = 0; i < arr.length; i++) {
            var arrI = arr[i];
            if (arrI) {
                var arrICranny = arrI.split(':');
                if (arrICranny[0]) {
                    var nameI = arrI.replace(arrICranny[0] + ':', '');
                    if (canEditD) {
                        htmlHJ += '<li><label><input type="checkbox" value="' + arrICranny[0] + '"/>' + nameI + '</label></li>';
                    } else { // class="cannotInput"
                        htmlHJ += '<li><label><input type="checkbox" disabled  value="' + arrICranny[0] + '"/>' + nameI + '</label></li>';
                    }

                }
            }
        }
        return htmlHJ;
    },
    spacialInputHasStep: function (spacialInputAfterSys, buffTheMagic, thisName, options, afterSystemChange) {
        if (!spacialInputAfterSys || !spacialInputAfterSys.length) return false;
        for (var ki = 0; ki < spacialInputAfterSys.length; ki++) {
            var optionsMS = spacialInputAfterSys[ki].options || options;
            var urlAnd = spacialInputAfterSys[ki].url;
            var eleMent = spacialInputAfterSys[ki].element;
            var name = spacialInputAfterSys[ki].name;
            var inputNode = $('.form_' + name, buffTheMagic);
            var changeAfter = spacialInputAfterSys[ki].onceChange;
            //var afterGotDataShouldDo=spacialInputAfterSys[ki].afterInit;
            var ifHiddenId = spacialInputAfterSys[ki].hidden === 'id';
            var goNext = !thisName ? true : thisName === name;
            var urlAndParam = {};

            if (urlAnd) {
                urlAndParam = {
                    url: urlAnd,
                    data: spacialInputAfterSys[ki].param,
                    valueBack: spacialInputAfterSys[ki].valueBack,
                    setData: spacialInputAfterSys[ki].setData,
                    hiddenId: ifHiddenId
                };
            } else {
                urlAndParam = {
                    hiddenId: ifHiddenId
                };
            }
            if (goNext) {
                if (eleMent === 'inputSelect') {
                    if (name == 'provinceName') {
                        inputAndSelect(urlAndParam, optionsMS, inputNode, 'ulSwBottom', buffTheMagic, false, changeAfter);
                    } else { //afterSystemChange 这个参数 现只针对角色变更系统的三个
                        inputAndSelect(urlAndParam, optionsMS, inputNode, '', buffTheMagic, false, changeAfter, afterSystemChange)
                    }
                    //urlAndParam,options,thisInput,ulClassName,eventEntrust,afterValue
                } else if (eleMent === 'selectMore') {
                    if (name == 'mediaType') {
                        selectMoreKK(urlAndParam, optionsMS, inputNode, 'ulSw', buffTheMagic, false)
                    } else {
                        selectMoreKK(urlAndParam, optionsMS, inputNode, '', buffTheMagic, false)
                    }
                } else if (eleMent === 'textareaInputSelect') {
                    inputAndSelect(urlAndParam, optionsMS, inputNode, 'ulSwBottom', buffTheMagic, true, changeAfter)
                }
            }
        }
    },
    nextDoOperation: function (handThislist, fascinateCan, url, assignee) {
        $.ajax({
            url: ACT_URL + '/act/orderManage/findDepNameByPhone',
            method: 'POST',
            data: {
                userId: assignee
            },
            dataType: 'json',
            success: function (res) {
                if (res && res.length === 1) {
                    safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, true, [{
                        value: res.DEP_NAME,
                        name: 'belongDep'
                    }]);
                } else {
                    safeOrder.renderAndTableFormNow(whatNeed, fascinateCan, urlList, handThislist, false);
                }
            }
        })
    },
    formValidationSS: function (currentTab, formNode) {
        var error2 = $('.alert-danger', formNode);
        var success2 = $('.alert-success', formNode);
        formNode.validate({
            focusCleanup: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "", // validate all fields including form hidden input
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) { //不通过回调
                return false;
            },
            highlight: function (element, errorClass, validClass) { // hightlight error inputs
                $(element).closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group
            },
            success: function (label, element, form) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },
            submitHandler: function (form) {
                success2.show();
                error2.hide();
                return false;
            }
        });
    },
    formElementRender: function (thisEle, canOnlyChangeThis, noName) {
        //name:'createPerson',indexName:'CREATE_PERSON', title:'工单发起人', element:'input', readonly:'true', required:'true',
        var element = thisEle.element;
        var widthClass = thisEle.halfWidth ? ' col-md-6' : ' col-md-12';
        var noNameNeedTip = noName && thisEle.required === 'true' ? '<span class="must_fill_DC">*</span>' : '';
        var widthCol = 'col-md-4';
        var widthColIn = 'col-md-8';
        //		if(){
        //			widthCol='col-md-2';
        //			widthColIn='col-md-10';
        //		}
        if (element === 'textarea' && noName) {
            widthCol = 'col-md-2';
            widthColIn = 'col-md-10 tiptide_waves_no';

        }
        var stepByStep = '<div class="form-group form-group_me_change ' + widthClass + '">' +
            '<label class="control-label ' + widthCol + '">' + noNameNeedTip + thisEle.title + '</label>' +
            '<div class="' + widthColIn + '">' +
            '<div class="input-icon right">' +
            '<i class="fa"></i>';
        var isReadOnly = thisEle.readonly == 'true' ? 'readonly="readonly"' : '';
        var optionK = thisEle.options;
        var htmlOption = '';
        var nameAttr = noName ? '' : 'name="' + thisEle.name + '"';


        if (canOnlyChangeThis) {
            var isDisabledChange = 'readonly="readonly"';
            if (thisEle.name === 'userName') {
                isDisabledChange = '';
            }
            if (element === 'textarea') {
                stepByStep += '<textarea rows="3" data-noo="yes" class="form-control form_' + thisEle.name + '" ' + isDisabledChange + '  placeholder="请输入' + thisEle.title + '"></textarea></div></div></div>';
            } else {
                stepByStep += '<input type="text" class="form-control input-sm form_' + thisEle.name + '" ' + isDisabledChange + ' ' + nameAttr + ' placeholder="请输入' + thisEle.title + '" /></div></div></div>';
            }
            return stepByStep;
        }
        var attrSet = '';
        var hiddenElement = thisEle.hidden === 'id' ? '<input class="form_' + thisEle.name + '_id" type="hidden" >' : '';
        stepByStep = stepByStep + hiddenElement;
        var idDisabled = thisEle.disabled ? 'disabled="disabled"' : ''
        switch (element) {
            case 'input':
                stepByStep += '<input type="text" ' + idDisabled + ' ' + attrSet + ' class="form-control input-sm form_' + thisEle.name + '" ' + isReadOnly + ' ' + nameAttr + ' placeholder="请输入' + thisEle.title + '" />';
                break;
            case 'inputTime':
                stepByStep += '<input type="text" ' + attrSet + ' class="form-control input-sm form_' + thisEle.name + ' datetimeKJApplay" ' + isReadOnly + ' ' + nameAttr + ' placeholder="请输入' + thisEle.title + '" />';
                break;
            case 'select':
                stepByStep += '<select class="form-control input-sm form_' + thisEle.name + '" ' + isReadOnly + ' ' + nameAttr + ' >';
                if (optionK && optionK.length) {
                    for (var i = 0; i < optionK.length; i++) {
                        if (optionK[i]) {
                            htmlOption += '<option value="' + optionK[i] + '">' + optionK[i] + '</option>';
                        }
                    }
                }
                stepByStep += htmlOption + '</select>';
                break;
            case 'textareaInputSelect':
                stepByStep += '<textarea rows="2" data-noo="yes" class="form-control form_' + thisEle.name + '" ' + nameAttr + ' ' + isReadOnly + '  placeholder="请输入' + thisEle.title + '"></textarea>';
                break;
            case 'textarea':
                stepByStep += '<textarea maxlength="1000" rows="2" onblur="orderComm.blurTextarea(this)" onfocus="orderComm.focusTextarea(this)" data-noo="yes" class="form-control form_' + thisEle.name + '" ' + nameAttr + ' ' + isReadOnly + '  placeholder="请输入' + thisEle.title + '"></textarea>';
                break;
            case 'textareaNolimit':
                stepByStep += '<textarea maxlength="1000" rows="2"  data-noo="yes" class="form-control form_' + thisEle.name + '" ' + nameAttr + ' ' + isReadOnly + '  placeholder="请输入' + thisEle.title + '"></textarea>';
                break;
            case 'selectMore':
            case 'inputSelect':
            default:
                if (thisEle.dataCanowner) {
                    attrSet = 'data-canowner="true"'
                }
                stepByStep += '<input type="text" ' + idDisabled + ' ' + attrSet + ' autocomplete="off" class="form-control input-sm form_' + thisEle.name + '" ' + isReadOnly + ' ' + nameAttr + ' placeholder="请输入' + thisEle.title + '" />';
                break;
        }
        if (thisEle.tips) {
            stepByStep = stepByStep + '<p class="remindYou_p"> *' + thisEle.tips + '</p></div></div></div>'
        } else {
            stepByStep = stepByStep + '</div></div></div>';
        }
        return stepByStep;
    },
    renderAndTableFormNow: function (whatNeed, fascinateCan, url, handThislist, canEditD, staticValue, superOne) {
        if (!whatNeed) return false;
        var canOnlyChangeThis = false;
        var timeAddMoreK = url.spacialClass || '';
        var timeIndex = nowJSP().find('.portlet').attr('data-time') + timeAddMoreK;
        var canEdit = canEditD;
        if (canEditD) {
            canEdit = handThislist.taskDefinitionKey === 'usertask1' || handThislist.taskDefinitionKey === '';
        }

        var modalEditOrAdd = $('#pomegranate_' + timeIndex, fascinateCan);
        var editHtml = ''; //typeB
        var addBtn = url.add ? '<span data-toggle="modal"  style="margin-left:40px;" class="btn green ' + timeIndex + '-addbtn mr-10"> 增加 <i class="fa fa-plus"></i></span>' : '';
        var editBtn = url.edit ? '<span data-toggle="modal" class="btn blue ' + timeIndex + '-editbtn mr-10"> 编辑 <i class="fa fa-edit"></i></span>' : '';
        var delBtn = url.del ? '<span data-toggle="modal" class="btn red ' + timeIndex + '-delbtn mr-10"> 删除 <i class="fa fa-trash-o"></i></span>' : '';
        var importBtn = url.imFile ? '<span data-toggle="modal" class="btn yellow ' + timeIndex + '-importbtn mr-10"> 导入</span>' : '';
        var moduleOut = url.templateFile ? '<span class="Time_rolls_on btn  blue-soft ' + timeIndex + '_template">导出模版</span>' : '';
        //var turnsOut=url.turnOut?'<span class="Time_rolls_on btn  blue-hoki '+timeIndex+'_therefore">导出账号信息</span>':'';
        if (url.turnOut) {
            if (timeAddMoreK) {
                turnsOut = '<span class="Time_rolls_on btn  blue-hoki ' + timeIndex + '_therefore">导出权限申请信息</span>';
            } else {
                turnsOut = '<span class="Time_rolls_on btn  blue-hoki ' + timeIndex + '_therefore">导出账号信息</span>';
            }
        }
        var turnsIns = url.turnIn ? '<span class="Time_rolls_on btn  green ' + timeIndex + '_shapeMyHeart">导入</span>' : '';
        if (canEdit) {
            editHtml = addBtn + editBtn + delBtn + importBtn;
            if (url.templateFile) {
                editHtml = editHtml + moduleOut;
            }
            if (url.turnOut) {
                editHtml = editHtml + turnsOut;
            }
        }
        if (!editHtml && superOne) {
            editHtml = editBtn + turnsOut + turnsIns;
            canOnlyChangeThis = true;
        }
        var contanierInnerQuery = '';
        if (url.type === 'operation' || url.type === 'data' || url.type === 'lego') {
            var queryNeed = '';
            if (url.type === 'operation') {
                queryNeed = '<div class="river_block_way"><label style="margin-left:20px;">权限名称：</label><input class="' + timeIndex + '_canner_query_rightName" type="text" /></div>';
            } else if (url.type === 'data') {
                queryNeed = '<div class="river_block_way"><label style="margin-left:20px;">功能项：</label><input class="' + timeIndex + '_canner_query_rightDepart" type="text" /></div>' +
                    '<div class="river_block_way"><label style="margin-left:20px;">路径：</label><input class="' + timeIndex + '_canner_query_rightPath" type="text" /></div>';

            }
            contanierInnerQuery = '<div class="' + timeIndex + '_canner_query">' +
                '<h4>权限矩阵图<br/> <br/> <div class="river_block_way"><label style="margin-left:0px;">系统类别：</label><select style="width:130px;" class="' + timeIndex + '_canner_query_select"></select></div><div class="river_block_way"><label style="margin-left:20px;">部门名称：</label><input class="' + timeIndex + '_canner_query_dep" type="text" /></div>' + queryNeed + '<div class="river_block_way"><span data-toggle="modal" class="btn yellow ' + timeIndex + '-searchbtn mr-10" style="margin-left:10px;" > 搜索</span></div></h4>' +
                '<table class="table table-striped table-bordered table-hover table-scroll-can table_many_head" id="' + timeIndex + '_query_table"></table>' +
                '</div>';
        }
        var titleKOJK = '账号信息';
        var classTableBorder = '';
        if (url.typeB === '4a') {
            classTableBorder = 'tableBlockHasBorder';
            titleKOJK = '账号申请信息表';
        }
        if (url.typeB === 'right') {
            classTableBorder = 'tableBlockHasBorder';
            titleKOJK = '权限申请表';
        }
        var contanier = '<div class="tableCannotBeUn ' + classTableBorder + ' list-group col-md-12" style="margin-left:0;margin-right:0;box-sizing:border-box;padding:20px 0;"> <div  style="margin-left:0;margin-right:0" class="col-md-12"><div class="' + timeIndex + '_canner">' +
            '<div class="' + timeIndex + '_canner_do" style="box-sizing:border-box;padding-bottom:10px;">' +
            '<h4 style="margin-bottom:20px;">' + titleKOJK + editHtml + '</h4>' +
            '<table class="table table-striped table-bordered table-hover table-scroll-can table_many_head" id="' + timeIndex + '_table"></table>' +
            '</div>' + contanierInnerQuery + '</div></div></div>';
        var buffTheMagic = modalEditOrAdd.find('#form_pomegranate_' + timeIndex);
        safeOrder.formValidationSS(fascinateCan, buffTheMagic); //验证

        var cannerPP = fascinateCan.find('textarea[name=safe1_secretDescribe]').parent().parent();
        cannerPP.after(contanier);
        var fascinateCanForm = fascinateCan.find('form').first();
        var cannerDoSome = fascinateCanForm.find('.' + timeIndex + '_canner_do');
        var cannerDoQuery = fascinateCanForm.find('.' + timeIndex + '_canner_query');
        var cannerDoQuerySelect = fascinateCanForm.find('.' + timeIndex + '_canner_query_select');

        var whatNeedlen = whatNeed.length;
        var columns = [{
            "sClass": "text-center", //添加类
            "data": "ID",
            "bSortable": false,
            "render": function (data, type, full, meta) {
                return '<div class="checker"><span><input type="checkbox" class="checkboxes" value="1"></span></div>';
            }
        }];
        var tableHeadHtml = '<th class="table-checkbox"><input type="checkbox" class="group-checkable" data-set="#' + timeIndex + '_table .checkboxes"/></th>';
        var formHtml = '';
        var ruleNeed = [];
        var valueSet = []; //重置值的时候
        var spacialInput = [];
        for (var i = 0; i < whatNeedlen; i++) {
            var nowIk = whatNeed[i];
            //*（*（（还有三个业务'LEVEL_1','LEVEL_2','LEVEL_3','AREA'
            if (url.type === 'fourthA' && (nowIk.indexName === 'RESOURCE_IP' || nowIk.indexName === 'LEVEL_1' || nowIk.indexName === 'LEVEL_2' || nowIk.indexName === 'LEVEL_3' || nowIk.indexName === 'AREA')) {
                columns.push({
                    "data": nowIk.indexName,
                    "bSortable": false,
                    "render": function (data, type, full, meta) {
                        data = reproduceValue(data);
                        if (data) {
                            if (data.indexOf(',') > -1) {
                                var dataArr = data.split(',');
                                var finHtml = '';
                                for (var di = 0; di < dataArr.length; di++) {
                                    if (dataArr[di]) {
                                        finHtml += '<p>' + dataArr[di] + '</p>';
                                    }
                                }
                                return '<div class="when_content_sooLong-inner"><p>' + dataArr[0] + '</p>' + '<div class="when_content_sooLong-inner-momo momo_left" style="width:200px;">' + finHtml + '...</div></div>';
                            } else {
                                return data;
                            }
                        }
                        return '';
                    }
                });
            } else {
                columns.push({
                    "data": nowIk.indexName,
                    "bSortable": false,
                    "render": showContentCermitic
                });
            }
            tableHeadHtml += '<th>' + nowIk.title + '</th>';
            formHtml += safeOrder.formElementRender(nowIk, canOnlyChangeThis);
            valueSet.push({
                name: nowIk.name,
                nameIndex: nowIk.indexName,
                nochange: nowIk.mayNo === 'true'
            });
            if (nowIk.required !== '') {
                ruleNeed.push({
                    name: nowIk.name,
                    rule: nowIk.required,
                    title: nowIk.title,
                    isNotReqire: nowIk.requiredTip === 'false',
                })
            }
            if (nowIk.element === 'selectMore' || nowIk.element === 'inputSelect' || nowIk.element === 'textareaInputSelect') {
                spacialInput.push(nowIk);
            }
        }
        modalEditOrAdd.find('.form-body').html(formHtml);

        if (staticValue && staticValue.length > 0) {
            for (var op = 0; op < staticValue.length; op++) {
                if (staticValue[op]) {
                    $('.form_' + staticValue[op].name, modalEditOrAdd).val(staticValue[op].value);
                }
            }
        }

        //增加验证
        var ruleNeedLen = ruleNeed.length;
        if (ruleNeedLen > 0) {
            for (var n = 0; n < ruleNeedLen; n++) {
                var nodeRule = $('.form_' + ruleNeed[n].name, buffTheMagic);
                if (nodeRule && nodeRule.length > 0) {
                    var rulesLeft = {};
                    if (ruleNeed[n].isNotReqire) { //有验证 但有些情况不是必填的
                        rulesLeft = {
                            messages: {}
                        };
                    } else {
                        rulesLeft = {
                            required: true,
                            messages: {
                                required: "请输入" + ruleNeed[n].title,
                            }
                        }
                    }
                    if (ruleNeed[n].rule === 'phone') {
                        rulesLeft.phone = true;
                        rulesLeft.messages.phone = '请输入正确的手机号';
                    } else if (ruleNeed[n].rule === 'email') {
                        rulesLeft.email = true;
                        rulesLeft.messages.email = '请输入正确的邮箱';
                    } else if (ruleNeed[n].rule === 'numAndLett') {
                        rulesLeft.numAndLett = true;
                        rulesLeft.messages.numAndLett = '此处输入内容由数字和字母组成';
                    } else if (ruleNeed[n].rule === 'ip') {
                        rulesLeft.ip = true;
                        rulesLeft.messages.ip = '请输入正确的 IP 格式';
                    } else if (ruleNeed[n].rule === 'ips') {
                        rulesLeft.ips = true;
                        rulesLeft.messages.ips = '请输入正确的 IP 格式,且多个 IP 请用英文逗号分隔';
                    } else if (ruleNeed[n].rule === 'number') {
                        rulesLeft.number = true;
                        rulesLeft.messages.number = '请输入数字';
                    }
                    nodeRule.rules("add", rulesLeft);
                }
            }
        }

        $('#' + timeIndex + '_table', fascinateCan).html('<thead><tr>' + tableHeadHtml + '</tr></thead>');
        var tableTable = $('#' + timeIndex + '_table', fascinateCan);
        tableTable.dataTable($.extend({
            "ajax": function (data, callback, settings) {
                startProcess();
                var param = {
                    processInstanceId: $("input[name='processInstanceId']", modalEditOrAdd).val(),
                    start: data.start,
                    length: data.length,
                    //type:url.type,
                };
                if (url.typeB !== 'right') {
                    param.type = url.type;
                }
                $.ajax({
                    type: "POST",
                    url: url.doTable,
                    data: param,
                    dataType: "json",
                    beforeSend: function (xhr) {},
                    success: function (result) {
                        if (!result || result.errorCode) {
                            endProcess();
                            $.dialog.alert("查询失败");
                            return;
                        }
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.iTotalRecords || 0;
                        returnData.recordsFiltered = result.iTotalRecords || 0;
                        returnData.data = result.data || [];
                        callback(returnData);
                        endProcess();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        endProcess();
                        $.dialog.alert("查询失败");
                    }
                });
            },
            "order": [],
            "columns": columns,
            "fnDrawCallback": function () {
                var oTable = tableTable.dataTable();
                var redirectpage = 0;
                $('#redirect', fascinateCan).keyup(function (e) {
                    if ($(this).val() && $(this).val() > 0) {
                        redirectpage = $(this).val() - 1;
                    }
                    oTable.fnPageChange(redirectpage);
                });
                $('#' + timeIndex + '_table_wrapper', currentTab).find('.page_jump').each(function () {
                    $(this).remove();
                })
            },
            "initComplete": function () {}
        }, {
            "language": {
                "info": "显示第 _START_ 到 _END_ 条数据，总共 _TOTAL_ 条数据",
                "infoEmpty": "总共 0 条数据",
                "emptyTable": "没有数据可以显示",
            },
            "lengthChange": false,
            "bStateSave": true,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "scrollX": true,
            "pageLength": 10,
            "bPaginate": true, // 分页按钮
            "serverSide": true,
            "renderer": "bootstrap",
        })).api();
        if (url.type === 'operation' || url.type === 'data' || url.type === 'lego') {
            safeOrder.choiceYouSystem({
                cannerDoQuerySelect: cannerDoQuerySelect,
                timeIndex: timeIndex,
                fascinateCan: fascinateCan,
                urlList: url
            });
        }

        safeOrder.bindEventFormNow(canEdit, timeIndex, fascinateCanForm.parent(), fascinateCan, cannerDoQuerySelect, buffTheMagic, valueSet, modalEditOrAdd, url, canOnlyChangeThis);
        if (!canOnlyChangeThis) {
            for (var ki = 0; ki < spacialInput.length; ki++) {
                var optionsMS = spacialInput[ki].options || [];
                var urlAnd = spacialInput[ki].url;
                var eleMent = spacialInput[ki].element;
                var noComparison = spacialInput[ki].noComparison || '';
                var name = spacialInput[ki].name;
                var inputNode = $('.form_' + name, modalEditOrAdd);
                var changeAfter = spacialInput[ki].onceChange;
                var urlAndParam = {
                    tellYou: spacialInput[ki].tipNeed ? '当前账号部门不存在对应业务系统，请联系管理员' : ''
                };
                var doafter = spacialInput[ki].doafter || '';
                if (urlAnd) {
                    urlAndParam = {
                        url: urlAnd,
                        data: spacialInput[ki].param,
                        valueBack: spacialInput[ki].valueBack,
                        setData: spacialInput[ki].setData,
                        noComparison: noComparison,
                    };
                }
                if (eleMent === 'inputSelect') {
                    if (name == 'provinceName') {
                        inputAndSelect(urlAndParam, optionsMS, inputNode, 'ulSwBottom', buffTheMagic, false, changeAfter);
                    } else {
                        //目前只有账号申请的applySystem 有tipNeed
                        inputAndSelect(urlAndParam, optionsMS, inputNode, '', buffTheMagic, false, changeAfter, doafter)
                    }
                    //urlAndParam,options,thisInput,ulClassName,eventEntrust,afterValue
                } else if (eleMent === 'selectMore') {
                    if (name == 'mediaType') {
                        selectMoreKK(urlAndParam, optionsMS, inputNode, 'ulSw', buffTheMagic, false)
                    } else {
                        selectMoreKK(urlAndParam, optionsMS, inputNode, '', buffTheMagic, false, doafter)
                    }
                } else if (eleMent === 'textareaInputSelect') {
                    inputAndSelect(urlAndParam, optionsMS, inputNode, 'ulSwBottom', buffTheMagic, true, changeAfter, doafter)
                }
            }
        }
        safeOrder.operationBindEventFormEle(buffTheMagic, canOnlyChangeThis, url);
        safeOrder.needRefreshTable(handThislist.processInstanceId, timeIndex, fascinateCan, url, cannerDoQuerySelect)
    },
    needRefreshTable: function (processInstanceId, timeIndex, fascinateCan, urlList, cannerDoQuerySelect) {
        var currentTab = nowJSP();
        var currentTabCan = $('#safe_usertask1_' + processInstanceId, currentTab);
        currentTabCan.find('.panel-title .collapsed').on('click', function (e) {
            if (currentTabCan.find('#safe-collapseFirst_' + processInstanceId).attr('aria-expanded') === 'false') {
                $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw();
                if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                    safeOrder.initTable('#' + timeIndex + '_query_table', fascinateCan, urlList, cannerDoQuerySelect, timeIndex);
                }
            }
        })
        currentTabCan.parents('.portlet-body').parent().children(".portlet-title").find('.btn-success').on('click', function () {
            $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw();
            if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                safeOrder.initTable('#' + timeIndex + '_query_table', fascinateCan, urlList, cannerDoQuerySelect, timeIndex);
            }
        });
    },
    operationAccountIfExist: function (fun, type, data, modalEditOrAdd, justClickOnce) {
        if (!fun || typeof fun !== 'function' || !type || !data) return false;
        var whatApply = $('.form_applyType', modalEditOrAdd).val();
        if (type !== 'operation' || whatApply !== '开通账号') {
            return fun()
        } //不是operation或申请业务不是开通账号时直接执行函数
        //账号唯一性
        loadingNeed(justClickOnce);
        $.ajax({
            type: 'POST',
            url: ACT_URL + '/act/orderManage/findAccountIfExist',
            dataType: 'json',
            data: {
                type: 'operation',
                applySystem: $('.form_applySystem', modalEditOrAdd).val(),
                phone: $('.form_phone', modalEditOrAdd).val(),
            },
            success: function (res) {
                if (res) { //不存在，可以继续请求
                    fun('nocover');
                } else { //false是已存在 提示
                    loadingNeed(justClickOnce);
                    msgAlert('该申请人员在对应系统下已存在账号，如有问题请联系管理员');
                    //业务系统 重置系统和权限组
                    $('.form_applySystem', modalEditOrAdd).val('');
                    $('.form_rightTeam', modalEditOrAdd).val('');
                }
            },
            error: function (err) {
                msgAlert('操作失败');
            }
        })
    },
    serverDoHere: function (type, url, data, timeIndex, fascinateCan, cannerDoQuerySelect, modalEditOrAdd, whatType) {
        if (!type || !url) return false;
        var wordSTell = '';
        if (type === 'add') {
            wordSTell = '新增';
        } else if (type === 'edit') {
            wordSTell = '编辑';
        } else if (type === 'delete') {
            wordSTell = '删除';
            data.type = whatType;
        }
        if (whatType === 'lego' || whatType === 'data') {
            if (type === 'delete') {} else {
                data = data + '&type=' + whatType;
            }
        }
        if (!wordSTell) return false;
        var justClickOnce = modalEditOrAdd.find('.modal-content');
        if (justClickOnce.hasClass('hasLoadingShow')) {
            AlertMsg('请求正在处理中，请稍等……');
            return false;
        }

        function springRainIsAsExpensiveAsOil(nocover) {
            if (!nocover) {
                loadingNeed(justClickOnce);
            }
            $.ajax({
                method: 'POST',
                url: url,
                data: data,
                success: function (res) {
                    loadingNeed(justClickOnce);
                    if (res === 'success' || res === "SUCCESS") {
                        modalEditOrAdd.modal('hide');
                        msgAlert(wordSTell + '成功', anatomyBehaviours);
                        $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw();
                    } else if (res === 'accountError') {
                        msgAlert(wordSTell + '失败:"授权账号/手机号"未在上方账号信息表中填写！', anatomyBehaviours);
                    } else {
                        modalEditOrAdd.modal('hide');
                        msgAlert(wordSTell + '失败', anatomyBehaviours);
                    }
                },
                error: function (err) {
                    loadingNeed(justClickOnce);
                    modalEditOrAdd.modal('hide');
                    msgAlert(wordSTell + '失败', anatomyBehaviours);
                }
            })
        }
        //在编辑前验证账号
        safeOrder.operationAccountIfExist(springRainIsAsExpensiveAsOil, whatType, data, modalEditOrAdd, justClickOnce)

    },
    choiceYouSystem: function (obj) {
        // {cannerDoQuerySelect,timeIndex,fascinateCan,urlList}
        var cannerDoQuerySelect = obj.cannerDoQuerySelect;
        var timeIndex = obj.timeIndex;
        var fascinateCan = obj.fascinateCan;
        var urlList = obj.urlList;
        //startProcess();
        $.ajax({
            method: 'POST',
            url: urlList.system,
            dataType: 'json',
            data: {
                type: urlList.type,
                //dep:urlList.department,
            },
            success: function (res) {
                //endProcess();
                if (res) {
                    var optionHtml = '';
                    var resLen = res.length;
                    if (resLen > 0) {
                        for (var i = 0; i < resLen; i++) {
                            optionHtml += '<option value=' + res[i].SYSTEM_ID + '>' + res[i].SYSTEM_NAME + '</option>';
                        }
                    } else {
                        msgAlert('当前账号部门不存在对应业务系统，请联系管理员');
                    }
                    cannerDoQuerySelect.html(optionHtml);
                    safeOrder.initTable('#' + timeIndex + '_query_table', fascinateCan, urlList, cannerDoQuerySelect, timeIndex);
                } else {
                    msgAlert('发生错误')
                }
            },
            error: function (err) {
                //endProcess();
                msgAlert('发生错误，点击确认重试')
            }
        })
    },
    bindEventFormNow: function (canEdit, timeIndex, nodeParent, fascinateCan, cannerDoQuerySelect, buffTheMagic, valueSet, modalEditOrAdd, urlList, canOnlyChangeThis) {
        var justClickOnce = buffTheMagic.find('.modal-content');
        if (!nodeParent) return false;
        //导入弹窗按钮
        $('#sophisticated_file_' + timeIndex, fascinateCan).on('change', function (e) {
            var val = $(this).val();
            var nameFile = e.target.files[0].name;
            $('#sophisticated_' + timeIndex, fascinateCan).find('.shangchuan_con').text(nameFile);
        });
        //		imFile:'', errorFile:'', templateFile:''
        //确定导入
        if (urlList.imFile || urlList.turnIn) {
            $('#sophisticatedFS_' + timeIndex, fascinateCan).on('click', function (e) {
                e.stopPropagation();
                var fileFr = $('#sophisticated_file_' + timeIndex, fascinateCan)[0].files[0];
                if (!fileFr) {
                    msgAlert('请选择要导入的文件！');
                    return false;
                }
                var formData = new FormData();
                var kkkk = /\.(?:xls|xlsx)$/;
                if (!kkkk.test(fileFr.name.toLowerCase())) {
                    msgAlert('请选择 .xls 或者 .xlsx 文件');
                    return false;
                }

                $('#sophisticated_' + timeIndex, fascinateCan).modal('hide');
                formData.append("uploadFile", fileFr);
                formData.append("fileName", fileFr.name);
                formData.append("userToken", userToken);
                formData.append("processInstanceId", $("input[name='processInstanceId']", modalEditOrAdd).val());
                if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                    var createP = $(".form_createPerson", modalEditOrAdd).val();
                    var bedepP = $(".form_belongDep", modalEditOrAdd).val();
                    if (!createP || !bedepP) {
                        var tableInevitable = $('#' + timeIndex + '_table', fascinateCan).dataTable()
                        var dataTableFrom = tableInevitable.fnGetNodes();
                        for (var ib = 0; ib < dataTableFrom.length; ib++) {
                            var datafromIB = tableInevitable.fnGetData(dataTableFrom[ib]);
                            if (ib == 0) {
                                createP = datafromIB.CREATE_PERSON;
                                bedepP = datafromIB.BELONG_DEP;
                                break;
                            }
                        }
                        formData.append("importState", 'true');
                    } else {
                        if (urlList.type === 'operation' || urlList.type === 'data') {
                            formData.append("importState", 'false');
                        }
                    }
                    formData.append("createPerson", createP);
                    formData.append("belongDep", bedepP);
                }
                if (urlList.type === 'data' || urlList.type === 'lego') {
                    formData.append("type", urlList.type);
                }
                if (justClickOnce.hasClass('hasLoadingShow')) {
                    AlertMsg('请求正在处理中，请稍等……')
                    return false;
                }
                loadingNeed(justClickOnce);
                $.ajax({
                    type: "POST",
                    url: urlList.imFile,
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        loadingNeed(justClickOnce);
                        switch (result) {
                            case 'success':
                                $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw()
                                msgAlert('成功导入！', anatomyBehaviours);
                                break;
                            case 'coloumnError':
                                msgAlert('列名配置错误', anatomyBehaviours);
                                break;
                            case 'typeError':
                                msgAlert('导入文件格式错误', anatomyBehaviours);
                                break;
                            case 'error':
                                msgAlert('导入失败', anatomyBehaviours);
                                break;
                            case null:
                                msgAlert('文件为空', anatomyBehaviours);
                                break;
                            default:
                                if (result.indexOf('-') > -1) {
                                    var tellD = result.split('-');
                                    $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw();
                                    if (urlList.errorFile) {
                                        msgConfirm('信息提示：</br>' + tellD[0] + '</br>更多详细信息，<strong>点击“确定”下载错误信息文件</strong>', function () {
                                            if (!tellD[1]) {
                                                msgAlert('错误信息文件获取失败！');
                                                return false;
                                            }
                                            justOneClickAway(urlList.errorFile, {
                                                fileName: tellD[1],
                                                userToken: userToken
                                            }, tellD[1])
                                            //formPOSTGreatCold({fileName:tellD[1],userToken:userToken},urlList.errorFile);
                                            anatomyBehaviours();
                                        }, anatomyBehaviours);
                                    } else {
                                        msgAlert('信息提示：</br>' + tellD[0], anatomyBehaviours);
                                    }
                                } else if (result.indexOf('失败：0条') > -1) {
                                    $("#" + timeIndex + "_table", fascinateCan).dataTable().fnDraw();
                                    msgAlert('导入成功！</br>' + result, anatomyBehaviours);
                                }
                                break;
                        }
                    },
                    error: function (err) {
                        loadingNeed(justClickOnce);
                        msgAlert('导入失败');
                    }
                });
            })
        }

        nodeParent.on('click', function (e) {
            e.stopPropagation();
            var targetClassName = ' ' + e.target.className + ' ';
            var nodeNow = $(e.target);
            var rowData = $('#' + timeIndex + '_table', fascinateCan).getDatableJsonArr();
            var rowDataLen = rowData.length;
            if (canEdit || canOnlyChangeThis) {
                if (urlList.turnOut) {
                    //导出表格账号信息
                    if (targetClassName.indexOf(timeIndex + '_therefore') > -1) {
                        var tableHasCan = $('#' + timeIndex + '_table', fascinateCan).dataTable()
                        var tableHasCanData = tableHasCan.fnGetNodes();
                        if (tableHasCanData.length < 1) {
                            var tableShowNameKO = urlList.typeB === 'right' ? urlList.name : '账号申请信息';
                            msgAlert(tableShowNameKO + '表中没有信息，无法进行导出操作');
                            return false;
                        }
                        var paramHHOOK = {}
                        if (urlList.typeB) {
                            paramHHOOK = {
                                procInstId: $("input[name='processInstanceId']", modalEditOrAdd).val(),
                                userToken: userToken,
                            };
                        } else {
                            paramHHOOK = {
                                processInstanceId: $("input[name='processInstanceId']", modalEditOrAdd).val(),
                                userToken: userToken,
                            };
                        }

                        formPOSTGreatCold(paramHHOOK, urlList.turnOut)
                        return false;
                    }
                }
            }
            if (canEdit) {
                if (targetClassName.indexOf(timeIndex + '-addbtn') > -1) {
                    safeOrder.beforeEditOrAdd('', buffTheMagic, valueSet, modalEditOrAdd, timeIndex, fascinateCan, cannerDoQuerySelect, urlList);
                    return false;
                }
                if (targetClassName.indexOf(timeIndex + '-importbtn') > -1) {
                    $('#sophisticated_file_' + timeIndex, fascinateCan).val('');
                    $('#sophisticated_' + timeIndex, fascinateCan).find('.shangchuan_con').html('');
                    $('#sophisticated_' + timeIndex, fascinateCan).modal('show');
                }
                if (targetClassName.indexOf(timeIndex + '-delbtn') > -1) {
                    if (rowDataLen === 0) {
                        AlertMsg('请选择要删除的数据');
                    } else if (rowDataLen === 1) {
                        var dataNow = rowData[0];
                        AlertConfirm('确认删除吗？', function () {
                            safeOrder.serverDoHere('delete', urlList.del, {
                                id: dataNow.ID
                            }, timeIndex, fascinateCan, cannerDoQuerySelect, modalEditOrAdd, urlList.typeB || urlList.type);
                        })
                    } else {
                        AlertMsg('当前只能删除一行数据');
                    }
                    return false;
                }
                //模版下载
                if (urlList.templateFile) {
                    if (targetClassName.indexOf(timeIndex + '_template') > -1) {
                        var paramHHOOK = {};
                        if (urlList.type === 'data' || urlList.type === 'lego') {
                            paramHHOOK.type = urlList.type;
                        }
                        paramHHOOK.userToken = userToken;
                        formPOSTGreatCold(paramHHOOK, urlList.templateFile)
                    }
                }
                if (targetClassName.indexOf(timeIndex + '-editbtn') > -1) {
                    if (rowDataLen === 0) {
                        AlertMsg('请选择要编辑的数据');
                    } else if (rowDataLen === 1) {
                        var dataNow = rowData[0];
                        if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                            if (dataNow['APPLY_TYPE'] || dataNow['APPLY_TYPE'] === '') {
                                safeOrder.opApplyTypeChange(dataNow['APPLY_TYPE'], modalEditOrAdd);
                            }
                            if (dataNow['BELONG_COMPANY'] || dataNow['BELONG_COMPANY'] === '') {
                                safeOrder.opBelongCompanyChange(dataNow['BELONG_COMPANY'], modalEditOrAdd);
                            }
                        }
                        safeOrder.beforeEditOrAdd(dataNow, buffTheMagic, valueSet, modalEditOrAdd, timeIndex, fascinateCan, cannerDoQuerySelect, urlList);
                    } else {
                        AlertMsg('当前只能编辑一行数据');
                    }
                    return false;
                }
            }
            if (canOnlyChangeThis) {
                if (targetClassName.indexOf(timeIndex + '-editbtn') > -1) {
                    if (rowDataLen === 0) {
                        AlertMsg('请选择要编辑的数据');
                    } else if (rowDataLen === 1) {
                        var dataNow = rowData[0];
                        safeOrder.beforeEditOrAdd(dataNow, buffTheMagic, valueSet, modalEditOrAdd, timeIndex, fascinateCan, cannerDoQuerySelect, urlList);
                    } else {
                        AlertMsg('当前只能编辑一行数据');
                    }
                    return false;
                }
                if (urlList.turnIn) {
                    //导入账号信息
                    if (targetClassName.indexOf(timeIndex + '_shapeMyHeart') > -1) {
                        $('#sophisticated_file_' + timeIndex, fascinateCan).val('');
                        $('#sophisticated_' + timeIndex, fascinateCan).find('.shangchuan_con').html('');
                        $('#sophisticated_' + timeIndex, fascinateCan).modal('show');
                        return false;
                    }
                }
            }
            if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                if (targetClassName.indexOf(timeIndex + '-searchbtn') > -1) {
                    try {
                        $('#' + timeIndex + '_query_table', fascinateCan).dataTable().fnDestroy();
                    } catch (e) {}
                    safeOrder.initTable('#' + timeIndex + '_query_table', fascinateCan, urlList, cannerDoQuerySelect, timeIndex);
                    return false;
                }
            }
        })
        //绑定事件
    },
    beforeEditOrAdd: function (data, buffTheMagic, valueSet, modalEditOrAdd, timeIndex, fascinateCan, cannerDoQuerySelect, urlList) {
        buffTheMagic.find('.has-success').removeClass("has-success");
        buffTheMagic.find('.has-error').removeClass('has-error');
        buffTheMagic.find('.help-block-error').remove();
        var valueSetLen = valueSet.length;
        var nameINeed = []; //applyType belongCompany
        var holdsRule = '';
        if (urlList.type === 'operation') {
            holdsRule = safeOrder.OperationRule();
        }
        for (var i = 0; i < valueSetLen; i++) {
            var nameOk = valueSet[i];
            var thisValue = '';
            if (data) {
                thisValue = data[nameOk.nameIndex];
                $('.form_' + nameOk.name, modalEditOrAdd).val(thisValue);
                if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') { //编辑赋值带出权限
                    if (nameOk.name === 'applyType' || nameOk.name === 'belongCompany') {
                        nameINeed.push({
                            name: nameOk.name,
                            value: thisValue
                        });
                    }
                }
                if (urlList.type === 'operation' && holdsRule) {
                    if (nameOk.name === 'applySystem') {
                        holdsRule.applySystemRule(thisValue, buffTheMagic);
                    }
                    if (nameOk.name === 'rightTeam') {
                        holdsRule.rightTeamRule(thisValue, buffTheMagic);
                    }
                }
            } else {
                if (!nameOk.nochange) {
                    $('.form_' + nameOk.name, modalEditOrAdd).val(thisValue);
                }
                if (urlList.type === 'operation' || urlList.type === 'data' || urlList.type === 'lego') {
                    safeOrder.opApplyTypeChange('', buffTheMagic);
                    safeOrder.opBelongCompanyChange('', buffTheMagic);
                }
            }
        }
        if (data) {
            $('.id', modalEditOrAdd).val(data.ID);
        } else {
            $('.id', modalEditOrAdd).val('');
        }
        var sureBtn = modalEditOrAdd.find('#_' + timeIndex + '_posure');
        sureBtn.unbind();
        sureBtn.on('click', function () {
            var ifValueSet = buffTheMagic.valid();
            if (!ifValueSet) {
                return false;
            }
            //验证
            params = buffTheMagic.serialize();
            var type = '';
            if (data) {
                type = 'edit';
                params = params + '&id=' + $('.id', modalEditOrAdd).val();
            } else {
                type = 'add';
            }
            var ifIcanGo = safeOrder.needVaildBeforNext(modalEditOrAdd, urlList);

            if (!ifIcanGo) {
                return false;
            }
            safeOrder.serverDoHere(type, urlList[type], params, timeIndex, fascinateCan, cannerDoQuerySelect, modalEditOrAdd, urlList.type)
        })
        modalEditOrAdd.modal('show');
    },
    needVaildBeforNext: function (modalEditOrAdd, urlList) {
        var typeNowCC = urlList.type;
        if (typeNowCC === 'operation' || typeNowCC === 'data' || typeNowCC === 'lego') {
            var rightV = $('.form_rightTeam', modalEditOrAdd).val();
            var emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            var doChangeInformV = $('.form_applyType', modalEditOrAdd).val();
            var doName = $('.form_nickName', modalEditOrAdd).val();
            var doUser = $('.form_userName', modalEditOrAdd).val();
            var doPhone = $('.form_phone', modalEditOrAdd).val();
            var doEmail = $('.form_email', modalEditOrAdd).val();
            if (!doName) {
                AlertMsg('使用人姓名不能为空！');
                return false;
            }
            if (doChangeInformV === '账号信息变更') {
                if (!doUser) {
                    AlertMsg('使用人账号必填！');
                    return false;
                }
                if (!doPhone || !doEmail) {
                    AlertMsg('申请业务为账号信息变更时，手机号、邮箱不能为空！');
                    return false;
                }
                //合格的手机号
                if (!/^1\d{10}$/.test(doPhone)) {
                    AlertMsg('请输入正确的手机格式');
                    return false;
                }
                //合格的邮件号
                if (!emailReg.test(doEmail)) {
                    AlertMsg('请输入正确的邮件格式');
                    return false;
                }
                return true;
            }
            if (doChangeInformV === '开通账号') {
                if (!doPhone || !doEmail) {
                    AlertMsg('申请业务为开通账号时，手机号、邮箱不能为空！');
                    return false;
                }
                //合格的手机号
                if (!/^1\d{10}$/.test(doPhone)) {
                    AlertMsg('请输入正确的手机格式');
                    return false;
                }
                //合格的邮件号
                if (!emailReg.test(doEmail)) {
                    AlertMsg('请输入正确的邮件格式');
                    return false;
                }
            } else {
                if (!doUser) {
                    AlertMsg('使用人账号必填！');
                    return false;
                }
            }
            //合格的手机号
            if (doPhone && !/^1\d{10}$/.test(doPhone)) {
                AlertMsg('请输入正确的手机格式');
                return false;
            }
            //合格的邮件号
            if (doEmail && !emailReg.test(doEmail)) {
                AlertMsg('请输入正确的邮件格式');
                return false;
            }
            if (urlList.type === 'operation') {
                if ($('.form_belongDep', modalEditOrAdd).val() == '市场部') {
                    var systemValue = $('.form_applySystem', modalEditOrAdd).val();
                    if (systemValue === 'VOMS' || systemValue === 'POMS') {
                        if (rightV.indexOf('CP') > -1 && !$('.form_cpRightName', modalEditOrAdd).val()) {
                            AlertMsg('账号所属部门为市场部，且申请系统为VOMS、POMS，角色包含CP时必填');
                            $('.form_cpRightName', modalEditOrAdd).css('border-color', 'red');
                            setTimeout(function () {
                                $('.form_cpRightName', modalEditOrAdd).css('border-color', '#ccc');
                            }, 1000)
                            return false;
                        }
                    }
                    //且申请系统为VOMS、POMS，角色包含CP时必填
                }
                if (rightV === '分省专区运营组' && !$('.form_provinceName', modalEditOrAdd).val()) {
                    $('.form_provinceName', modalEditOrAdd).css('border-color', 'red');
                    setTimeout(function () {
                        $('.form_provinceName', modalEditOrAdd).css('border-color', '#ccc');
                    }, 1000);
                    return false;
                }
            }
            //权限组和申请系统必填
            var applySystemValue = $('.form_applySystem', modalEditOrAdd).val();
            if (!applySystemValue) {
                AlertMsg('申请系统是必填的！');
                $('.form_applySystem', modalEditOrAdd).css('border-color', 'red');
                setTimeout(function () {
                    $('.form_applySystem', modalEditOrAdd).css('border-color', '#ccc');
                }, 1000);
                return false;
            }
            if (applySystemValue === 'MAM' && !$('.form_cpId', modalEditOrAdd).val()) {
                $('.form_cpId', modalEditOrAdd).css('border-color', 'red');
                AlertMsg('当申请系统是MAM时，CPID 是必填的！');
                setTimeout(function () {
                    $('.form_cpId', modalEditOrAdd).css('border-color', '#ccc');
                }, 1000);
                return false;
            }
            if ($('.form_applyType', modalEditOrAdd).val() !== '重置密码') {
                if (!$('.form_rightTeam', modalEditOrAdd).val()) {
                    $('.form_rightTeam', modalEditOrAdd).css('border-color', 'red');
                    setTimeout(function () {
                        $('.form_rightTeam', modalEditOrAdd).css('border-color', '#ccc');
                    }, 1000);
                    return false;
                }
            }

        } else if (typeNowCC === 'fourthA') {
            if (urlList.typeB === 'right') {
                var timeIndexRead = modalEditOrAdd.parents('.portlet').attr('data-time');
                //是权限还要判断 （授权账号/手机号）字段提交时检测是否在账号申请表中已填写未填写则提示本账号未在上方账号信息表中填写
                //现交给接口判断

                //资源ip格式校验
                var resourceIPS = $('.form_resourceIp', modalEditOrAdd).val();
                if (!resourceIPS) {
                    AlertMsg('资源 IP 是必填的！');
                    return false;
                }
                var ifIpK = safeOrder.isIPRight(resourceIPS, false);
                if (!ifIpK) {
                    AlertMsg('资源 IP 填写：请输入正确的 IP 格式');
                    return false;
                }
            }

        }
        return true;
    },
    isIPRight: function (value, hasNoDouhao) {
        var canotNext = false;
        if (value) {
            var isIP = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            var isIP6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            if (hasNoDouhao) {
                var valueArr = value.split(',');
                if (valueArr && valueArr.length > 0) {
                    var valueArrLen = valueArr.length;
                    for (var i = 0; i < valueArrLen; i++) {
                        if (!valueArr[i]) {
                            canotNext = true;
                            break;
                        }
                        if (isIP.test(valueArr[i]) || isIP6.test(valueArr[i])) {
                            canotNext = true;
                        } else {
                            canotNext = false;
                            break;
                        }
                    }
                } else {
                    canotNext = true;
                }
            } else {
                if (isIP.test(value) || isIP6.test(value)) {
                    canotNext = true;
                } else {
                    canotNext = false;
                }
            }
        } else {
            canotNext = true;
        }
        return canotNext;
    },
    operationBindEventFormEle: function (currentTab, canOnlyChangeThis, urlList) {
        var typeNowCC = urlList.type;
        if (typeNowCC === 'operation' || typeNowCC === 'data' || typeNowCC === 'lego') {
            $('.form_applyType', currentTab)[0].onchange = function (e) {
                var node = e.target;
                var value = $(node).val();
                if (value === '开通账号') {
                    $('.form_userName', currentTab).val('').attr('disabled', "disabled");
                } else {
                    $('.form_userName', currentTab).removeAttr('disabled');
                }
                safeOrder.opApplyTypeChange(value, currentTab);
            }
            $('.form_belongCompany', currentTab)[0].onchange = function (e) {
                var node = e.target;
                var value = $(node).val();
                safeOrder.opBelongCompanyChange(value, currentTab);
            }
            if (!canOnlyChangeThis) { //非在只可编辑的运维账户管理员
                $('.form_userName', currentTab)[0].onmourseover = function (e) {
                    var node = e.target;
                    var value = $('.form_applyType', currentTab).val();
                    if (value === '开通账号') {
                        AlertMsg('当申请业务类型为开通账号，使用人账户不用编辑');
                        $('.form_userName', currentTab).val('').attr('disabled', "disabled");
                    } else {
                        $('.form_userName', currentTab).removeAttr('disabled');
                    }
                }
            }
        } else if (typeNowCC === 'fourthA') {

        }


    },
    OperationRule: function () {
        var rule = {
            applySystemRule: function (value, currentTab) {
                //是 POMS、VOMS  ===>> CP支持方名称必填、 分省专区名 ｜｜ CPID 媒资（MAM）必填
                if ($('.form_applyType', currentTab).val() === '重置密码') {
                    $('.form_cpRightName', currentTab).attr('disabled', 'disabled').val('');
                    $('.form_cpId', currentTab).attr('disabled', 'disabled').val('');
                    return false;
                }
                var thisAApplySystemValue = value;
                var departMent = $('.form_belongDep', currentTab).val();
                var isVomPom = thisAApplySystemValue === 'VOMS' || thisAApplySystemValue === 'POMS';
                if (departMent === '市场部' && isVomPom) { //cpRightName
                    $('.form_cpRightName', currentTab).removeAttr('disabled');
                } else {
                    $('.form_cpRightName', currentTab).attr('disabled', 'disabled').val('');
                }
                console.log('========>>>>>>>>>>>>')
                if (thisAApplySystemValue == 'MAM') { //cpId
                    $('.form_cpId', currentTab).removeAttr('disabled');
                } else {
                    $('.form_cpId', currentTab).attr('disabled', 'disabled').val('');
                }
            },
            rightTeamRule: function (value, currentTab) {
                var thisAApplySystemValue = ',' + value + ',';
                if (thisAApplySystemValue.indexOf(',分省专区运营组,') > -1) { //provinceName
                    $('.form_provinceName', currentTab).removeAttr('disabled');
                } else {
                    $('.form_provinceName', currentTab).attr('disabled', 'disabled').val('');
                }
                var departMent = $('.form_belongDep', currentTab).val();
                console.log('========>>>>>>>>>>>>')
                if (departMent === '市场部' && thisAApplySystemValue.indexOf('CP') > -1) { //cpRightName
                    $('.form_cpRightName', currentTab).removeAttr('disabled');
                } else {
                    $('.form_cpRightName', currentTab).attr('disabled', 'disabled').val('');
                }
            },
        };
        return rule;

    },
    fourthAccountNeedRule: function () {
        var rule = {
            fristWork: function (value, currentTab) {
                if (value) {
                    $('.form_level2', currentTab).removeAttr('disabled').val('');
                    $('.form_level3', currentTab).val('');
                }
            },
            secondWork: function (value, currentTab) {
                if (value) {
                    $('.form_level3', currentTab).removeAttr('disabled').val('');
                }
            },
            cheakIp: function (value, currentTab) {
                if (!value) {
                    return true;
                }
                if (value && !/[^0-9\.\,]+/g.test(value)) {
                    return true;
                }
                return false;
            }

        };
        return rule;
    },
    OperationAccountNeed: function (value) {
        var ruleO = safeOrder.OperationRule();
        var tempArr = [{
            name: 'createPerson',
            indexName: 'CREATE_PERSON',
            mayNo: 'true',
            title: '工单发起人',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'belongDep',
            indexName: 'BELONG_DEP',
            mayNo: 'true',
            title: '账号归属部门',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'applyType',
            indexName: 'APPLY_TYPE',
            title: '申请业务类型',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['开通账号', '删除账号', '权限变更', '重置密码', '账号信息变更'],
        }, {
            name: 'belongCompany',
            indexName: 'BELONG_COMPANY',
            title: '使用人所属',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['咪咕视讯', '外部公司', '公司领导'], //
        }, {
            name: 'nickName',
            indexName: 'NICK_NAME',
            title: '使用人姓名',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateNickName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }],
            setData: ['phone', 'email'],
            valueBack: {
                valueSet: ['PHONE', 'EMAIL'],
                me: 'USER_NAME'
            }
        }, {
            name: 'userName',
            indexName: 'USER_NAME',
            title: '使用人账号',
            dataCanowner: 'true',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateUserName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }, {
                name: 'operateUser',
                dataFrom: 'userName'
            }, {
                name: 'type',
                data: 'operation'
            }],
            valueBack: {
                me: 'USER_NAME'
            }
        }, {
            name: 'phone',
            indexName: 'PHONE',
            title: '手机号码',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'email',
            indexName: 'EMAIL',
            title: '邮箱',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'applySystem',
            indexName: 'APPLY_SYSTEM',
            title: '申请系统',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/account/processManage/findSystemByDep',
            options: [{
                SYSTEM_NAME: '短信营销系统API'
            }],
            param: {
                type: 'operation',
                dep: value
            },
            valueBack: {
                me: 'SYSTEM_NAME',
                show: 'SYSTEM_NAME'
            },
            onceChange: ['rightTeam'],
            tipNeed: true,
            doafter: {
                before: '',
                after: ruleO.applySystemRule
            }, //是 POMS、VOMS  ===>> CP支持方名称必填、 分省专区名 ｜｜ CPID 媒资（MAM）必填
        }, { //selectMore true
            name: 'rightTeam',
            indexName: 'RIGHT_TEAM',
            title: '权限组',
            element: 'selectMore',
            readonly: 'true',
            required: '',
            url: ACT_URL + '/act/orderManager/findRoleName',
            param: [{
                name: 'systemName',
                dataFrom: 'applySystem'
            }, {
                name: 'depName',
                dataFrom: 'belongDep'
            }],
            valueBack: {
                me: 'ROLE_NAME'
            },
            doafter: {
                before: '',
                after: ruleO.rightTeamRule
            }
        }, {
            name: 'cpRightName',
            indexName: 'CP_RIGHT_NAME',
            title: 'CP支持方名称',
            element: 'input',
            readonly: '',
            disabled: 'true',
            required: '',
            tips: 'POMS、VOMS申请CP账号时填写权限名称',
            doafter: {
                before: '',
                after: ''
            }, // POMS、VOMS CP支持方名称 必填
        }, {
            name: 'cpId',
            indexName: 'CP_ID',
            title: 'CPID',
            element: 'input',
            readonly: '',
            required: '',
            disabled: 'true',
            doafter: {
                before: '',
                after: ''
            }, // 媒资（MAM）必填
        }, {
            // 	name:'operateName',indexName:'OPERATE_NAME', title:'运营产品名称', element:'input', readonly:'', required:'',disabled:'true'
            // },{
            name: 'mediaType',
            indexName: 'MEDIA_TYPE',
            title: '媒资平台类别',
            element: 'selectMore',
            readonly: 'true',
            required: '',
            options: ['长视频媒资', '短视频媒资', '合作方媒资']
        }, {
            name: 'provinceName',
            indexName: 'PROVINCE_NAME',
            title: '分省专区名',
            element: 'inputSelect',
            readonly: '',
            disabled: 'true',
            required: '',
            options: operationAccountNameByProvince,
            //申请系统为VOMS、POMS，选择角色为分省专区运营组时必填
        }, ];
        return tempArr
    },
    FourthAccountNeed: [{
        name: 'busyType',
        indexName: 'BUSY_TYPE',
        title: '业务类别',
        element: 'select',
        readonly: '',
        required: 'true',
        options: ['新建账号', '授权变更'],
    }, {
        name: 'accountName',
        indexName: 'USER_NAME',
        title: '账号',
        element: 'input',
        readonly: '',
        required: 'numAndLett',
        //url:ACT_URL+'/act/orderManage/findOperateNickName',param:[{name:'operateUserName',dataFrom:'nickName'}],setData:['phone','email','dep'],valueBack:{valueSet:['PHONE','EMAIL','DEP'],me:'USER_NAME'},tips:'若无账号则填姓名全拼'
    }, {
        name: 'ifManufac',
        indexName: 'IF_MANUFAC',
        title: '是否为厂商',
        element: 'select',
        readonly: '',
        required: 'true',
        options: ['是', '否'],
    }, {
        name: 'nickName',
        indexName: 'NICK_NAME',
        title: '真实姓名',
        element: 'input',
        readonly: '',
        required: 'true',
        //url:ACT_URL+'/act/orderManage/findOperateNickName',param:[{name:'operateUserName',dataFrom:'nickName'}],setData:['phone','email','dep'],valueBack:{valueSet:['PHONE','EMAIL','DEP'],me:'USER_NAME'},
    }, {
        name: 'dep',
        indexName: 'DEP',
        title: '部门（区分内外部）',
        element: 'input',
        readonly: '',
        required: 'true',
    }, {
        name: 'phone',
        indexName: 'PHONE',
        title: '手机号码',
        element: 'input',
        readonly: '',
        required: 'phone',
        requiredTip: ''
    }, {
        name: 'email',
        indexName: 'EMAIL',
        title: '邮箱',
        element: 'input',
        readonly: '',
        required: 'email',
        requiredTip: ''
    }, {
        name: 'ifupload',
        indexName: 'IF_UPLOAD',
        title: '是否申请上传权限',
        element: 'select',
        readonly: '',
        required: 'true',
        options: ['是', '否']
    }, {
        name: 'ifdownload',
        indexName: 'IF_DOWNLOAD',
        title: '是否申请下载权限',
        element: 'select',
        readonly: '',
        required: 'true',
        options: ['是', '否']
        //url:ACT_URL+'/account/processManage/getCMDBIp',
        //},{
        //name:'agreementType',indexName:'AGREEMENT_TYPE', title:'协议类型', element:'select', readonly:'', required:'true',options:['SSH','RDP','VNC','FTP','浏览器（Firefox）','浏览器（Chrome）','plsql','sqlplus','Robomongo'],
    }, ],
    FourthAccountNeedB: function () {
        var ruleGot = safeOrder.fourthAccountNeedRule();
        return [{
            name: 'authorizedAccount',
            indexName: 'AUTHORIZED_ACCOUNT',
            title: '授权账号/手机号',
            element: 'input',
            readonly: '',
            required: 'true',
            tips: '若有账号则填账号，没有则填手机号',
        }, {
            name: 'resourceIp',
            indexName: 'RESOURCE_IP',
            title: '资源 IP',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/account/processManage/getCMDBIp',
            param: [{
                name: 'resourceIp',
                dataFrom: 'resourceIp'
            }],
            tips: '请知悉，多地址机器填写管理IP',
            setData: ['level1', 'level2', 'level3', 'area'],
            valueBack: {
                valueSet: ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'AREA'],
                me: 'STORAGE_IP',
                keepFrontValue: "true"
            },
            doafter: {
                before: '',
                after: '',
                check: '',
                checkTip: '请输入正确的 IP 格式，多个 IP 用英文逗号分隔'
            },
            noComparison: 'true',
            dataCanowner: 'true',
        }, {
            name: 'level1',
            indexName: 'LEVEL_1',
            title: '一级业务系统',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'level2',
            indexName: 'LEVEL_2',
            title: '二级业务系统',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'level3',
            indexName: 'LEVEL_3',
            title: '三级业务系统',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'area',
            indexName: 'AREA',
            title: '生产域',
            element: 'input',
            readonly: '',
            required: '',
            requiredTip: ''
        }, {
            name: 'hostLoginAccount',
            indexName: 'HOST_LOGIN_ACCOUNT',
            title: '主机登陆账号',
            element: 'input',
            readonly: '',
            required: ''
        }, {
            name: 'agreementType',
            indexName: 'AGREEMENT_TYPE',
            title: '协议类型',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['ssh', 'rdp', 'vnc', 'ftp', '浏览器（firefox）', '浏览器（chrome）', 'plsql', 'sqlplus', 'Robomongo'],
        }, {
            name: 'effectTimes',
            indexName: 'EFFECT_TIMES',
            title: '有效时间（天）',
            element: 'input',
            readonly: '',
            required: 'number',
        }, ];
    },
    DataPlatformNeed: function (value) {
        var tempAs = [{
            name: 'createPerson',
            indexName: 'CREATE_PERSON',
            mayNo: 'true',
            title: '工单发起人',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'belongDep',
            indexName: 'BELONG_DEP',
            mayNo: 'true',
            title: '账号归属部门',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'applyType',
            indexName: 'APPLY_TYPE',
            title: '申请业务类型',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['开通账号', '删除账号', '权限变更', '重置密码', '账号信息变更'],
        }, {
            name: 'belongCompany',
            indexName: 'BELONG_COMPANY',
            title: '使用人所属公司',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['咪咕视讯', '外部公司', '公司领导'], //
        }, {
            name: 'nickName',
            indexName: 'NICK_NAME',
            title: '使用人姓名',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateNickName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }],
            setData: ['phone', 'email'],
            valueBack: {
                valueSet: ['PHONE', 'EMAIL'],
                me: 'USER_NAME'
            }
        }, {
            name: 'userName',
            indexName: 'USER_NAME',
            title: '使用人账号',
            dataCanowner: 'true',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateUserName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }, {
                name: 'operateUser',
                dataFrom: 'userName'
            }, {
                name: 'type',
                data: 'data'
            }],
            valueBack: {
                me: 'USER_NAME'
            }
        }, {
            name: 'phone',
            indexName: 'PHONE',
            title: '手机号码',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'email',
            indexName: 'EMAIL',
            title: '邮箱',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'applySystem',
            indexName: 'APPLY_SYSTEM',
            title: '申请系统',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/account/processManage/findSystemByDep',
            param: {
                type: 'data',
                dep: value
            },
            valueBack: {
                me: 'SYSTEM_NAME',
                show: 'SYSTEM_NAME'
            },
            onceChange: ['rightTeam'],
            tipNeed: true
        }, { //selectMore true
            name: 'rightTeam',
            indexName: 'RIGHT_TEAM',
            title: '权限组',
            element: 'selectMore',
            readonly: 'true',
            required: '',
            url: ACT_URL + '/act/orderManager/findRoleName',
            param: [{
                name: 'systemName',
                dataFrom: 'applySystem'
            }, {
                name: 'depName',
                dataFrom: 'belongDep'
            }],
            valueBack: {
                me: 'ROLE_NAME'
            }
        }, ];
        return tempAs;
    },
    LegoPlatformNeed: function (value) {
        var temo = [{
            name: 'createPerson',
            indexName: 'CREATE_PERSON',
            mayNo: 'true',
            title: '工单发起人',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'belongDep',
            indexName: 'BELONG_DEP',
            mayNo: 'true',
            title: '账号归属部门',
            element: 'input',
            readonly: 'true',
            required: 'true',
        }, {
            name: 'applyType',
            indexName: 'APPLY_TYPE',
            title: '申请业务类型',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['开通账号', '删除账号', '权限变更', '重置密码', '账号信息变更'],
        }, {
            name: 'belongCompany',
            indexName: 'BELONG_COMPANY',
            title: '使用人所属公司',
            element: 'select',
            readonly: '',
            required: 'true',
            options: ['咪咕视讯', '外部公司', '公司领导'], //
        }, {
            name: 'nickName',
            indexName: 'NICK_NAME',
            title: '使用人姓名',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateNickName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }],
            setData: ['phone', 'email'],
            valueBack: {
                valueSet: ['PHONE', 'EMAIL'],
                me: 'USER_NAME'
            }
        }, {
            name: 'userName',
            indexName: 'USER_NAME',
            title: '使用人账号',
            dataCanowner: 'true',
            element: 'inputSelect',
            dataCanowner: 'true',
            readonly: '',
            required: '',
            url: ACT_URL + '/act/orderManage/findOperateUserName',
            param: [{
                name: 'operateUserName',
                dataFrom: 'nickName'
            }, {
                name: 'operateUser',
                dataFrom: 'userName'
            }, {
                name: 'type',
                data: 'lego'
            }],
            valueBack: {
                me: 'USER_NAME'
            }
        }, {
            name: 'phone',
            indexName: 'PHONE',
            title: '手机号码',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'email',
            indexName: 'EMAIL',
            title: '邮箱',
            element: 'input',
            readonly: '',
            required: '',
        }, {
            name: 'applySystem',
            indexName: 'APPLY_SYSTEM',
            title: '申请系统',
            element: 'inputSelect',
            readonly: '',
            required: '',
            url: ACT_URL + '/account/processManage/findSystemByDep',
            param: {
                type: 'lego',
                dep: value
            },
            valueBack: {
                me: 'SYSTEM_NAME',
                show: 'SYSTEM_NAME'
            },
            onceChange: ['rightTeam'],
            tipNeed: true
        }, {
            name: 'rightTeam',
            indexName: 'RIGHT_TEAM',
            title: '权限组',
            element: 'selectMore',
            readonly: 'true',
            required: '',
            url: ACT_URL + '/act/orderManager/findRoleName',
            param: [{
                name: 'systemName',
                dataFrom: 'applySystem'
            }, {
                name: 'depName',
                dataFrom: 'belongDep'
            }],
            valueBack: {
                me: 'ROLE_NAME'
            }
        }, ];
        return temo;
    },
    RolehangeNeed: function (type) {

        var paramsNeed = [{
            //					name:'applyName',indexName:'APPLY_NAME',title:'申请人',element:'input',hidden:'',required:'true', readonly:'true',halfWidth:true
            //				},{
            //					name:'dep',indexName:'DEP',title:'所属公司/部门',element:'input',hidden:'',required:'true', readonly:'true',halfWidth:true
            //				},{
            //					name:'phone',indexName:'PHONE',title:'联系电话',element:'input',hidden:'',required:'phone', readonly:'',halfWidth:true
            //				},{
            name: 'identity',
            indexName: 'IDENTITY',
            title: '工号',
            element: 'input',
            hidden: '',
            required: 'true',
            readonly: '',
            halfWidth: true
        }, {
            name: 'applyTime',
            indexName: 'APPLY_TIME',
            title: '申请时间',
            element: 'inputTime',
            hidden: '',
            required: 'true',
            readonly: '',
            halfWidth: true
        }, {
            name: 'applyDescrib',
            indexName: 'APPLY_DESCRIB',
            title: '申请人职位描述',
            element: 'textarea',
            hidden: '',
            required: '',
            readonly: '',
        }, {
            name: 'applyGoal',
            indexName: 'APPLY_GOAL',
            title: '角色申请目的',
            element: 'textarea',
            hidden: '',
            required: '',
            readonly: '',
        }, {
            name: 'belongSystem',
            indexName: 'BELONG_SYSTEM',
            title: '角色所属系统名称',
            element: 'inputSelect',
            hidden: 'id',
            required: 'true',
            readonly: '',
            onceChange: ['belongDep', 'belongDep_id', 'roleName', 'roleName_id'],
            halfWidth: true
        }, {
            name: 'belongDep',
            indexName: 'BELONG_DEP',
            title: '角色所属部门',
            element: 'inputSelect',
            hidden: 'id',
            required: 'true',
            readonly: 'true',
            dataCanowner: 'true',
            onceChange: ['roleName', 'roleName_id'],
            halfWidth: true,
        }, {
            name: 'roleName',
            indexName: 'ROLE_NAME',
            title: '角色名称',
            element: 'inputSelect',
            hidden: 'id',
            required: 'true',
            readonly: 'true',
            dataCanowner: 'true',
            halfWidth: true
        }, {
            name: 'changeType',
            indexName: 'CHANGE_TYPE',
            title: '变更类型',
            element: 'select',
            hidden: '',
            required: 'true',
            readonly: '',
            options: ['创建', '变更', '撤销'],
            halfWidth: true
        }];
        return paramsNeed;
    },
    opBelongCompanyChange: function (value, currentTab) {
        //console.log('=====>>>>>',value);
        if (value === '外部公司' || value === '公司领导') {
            //if($('.form_applyType',currentTab).val()==='开通账号' || $('.form_applyType',currentTab).val()==='删除账号'){
            $('.form_nickName', currentTab).attr('data-edit', 'true');
            //}else{
            //$('.form_nickName',currentTab).removeAttr('data-edit');
            //}
        } else {
            $('.form_nickName', currentTab).removeAttr('data-edit');
        }
    },
    opApplyTypeChange: function (value, currentTab) {
        if (value === '账号信息变更') {
            //$('.form_nickName',currentTab).attr('data-edit','true');
            $('.form_userName', currentTab).removeAttr('disabled');

            if (!$('.form_rightTeam', currentTab).attr('disabled')) {
                $('.form_rightTeam', currentTab).attr('disabled', 'disabled').val('');
                $('.form_belongCompany', currentTab).attr('disabled', 'disabled').val('');
                $('.form_cpRightName', currentTab).attr('disabled', 'disabled').val('');
                $('.form_cpId', currentTab).attr('disabled', 'disabled').val('');
                //$('.form_operateName',currentTab).attr('disabled','disabled').val('');
                $('.form_mediaType', currentTab).attr('disabled', 'disabled').val('');
                $('.form_provinceName', currentTab).attr('disabled', 'disabled').val('');
            }
        } else {
            $('.form_belongCompany', currentTab).removeAttr('disabled');
            if (value === '重置密码') {
                if (!$('.form_rightTeam', currentTab).attr('disabled')) {
                    $('.form_rightTeam', currentTab).attr('disabled', 'disabled').val('');
                    $('.form_cpRightName', currentTab).attr('disabled', 'disabled').val('');
                    $('.form_cpId', currentTab).attr('disabled', 'disabled').val('');
                    //$('.form_operateName',currentTab).attr('disabled','disabled').val('');
                    $('.form_mediaType', currentTab).attr('disabled', 'disabled').val('');
                    $('.form_provinceName', currentTab).attr('disabled', 'disabled').val('');
                }
            } else {
                if ($('.form_rightTeam', currentTab).attr('disabled')) {
                    $('.form_rightTeam', currentTab).removeAttr('disabled');
                    $('.form_cpRightName', currentTab).removeAttr('disabled');
                    $('.form_cpId', currentTab).removeAttr('disabled');
                    //$('.form_operateName',currentTab).removeAttr('disabled');
                    $('.form_mediaType', currentTab).removeAttr('disabled');
                    $('.form_provinceName', currentTab).removeAttr('disabled');
                }
            }
            if (value === '开通账号') {
                safeOrder.opBelongCompanyChange($('.form_belongCompany').val(), currentTab);
                $('.form_userName', currentTab).attr('disabled', 'disabled').val('');
            } else {
                if ($('.form_userName', currentTab).attr('data-edit')) {
                    $('.form_userName', currentTab).removeAttr('data-edit').removeAttr('disabled');
                }
                if ($('.form_nickName', currentTab).attr('data-edit')) {
                    $('.form_nickName', currentTab).removeAttr('data-edit');
                }
            }
            // if(value==='删除账号'){
            // 	safeOrder.opBelongCompanyChange($('.form_belongCompany').val(),currentTab);
            // }

        }
    },
    initProperties: function () {
        var dateKey = nowJSP().find('.portlet').attr('data-time');
        var currentTab = handleList[dateKey].nodeKeep;
        var nowFrom = hrefCome[handleList[dateKey].key];
        var processInstanceId = nowFrom.processInstanceId;
        var orderId_prefix = nowFrom.orderId_prefix;
        var orderType = nowFrom.orderType;
        //保存流程数据
        if (processInstanceId != '') {
            this.parentDiv = $("#" + orderId_prefix + "HandleTask" + processInstanceId, currentTab);
        } else {
            this.parentDiv = $("#" + orderId_prefix + "Order" + processInstanceId, currentTab); //获取父DIV
            $("input[name='safe1_orderType']", createOrder.parentDiv).val(orderType);
        }
    },
    initTable: function (tableId, currentTab, urlList, systemIdNode, timeIndex) {
        var columnsNow = [];
        var systemId = systemIdNode.val();
        var table = $(tableId, currentTab);
        var typeDiff = urlList.type;
        var param = {
            systemId: systemId,
            type: typeDiff,
            depName: $('.' + timeIndex + '_canner_query_dep', currentTab).val(),
        };
        if (!urlList.query) return false;
        if (typeDiff === 'operation') {
            param.rightName = $('.' + timeIndex + '_canner_query_rightName', currentTab).val() || '';
        } else if (typeDiff === 'data') {
            param.rightDepart = $('.' + timeIndex + '_canner_query_rightDepart', currentTab).val() || '';
            param.rightPath = $('.' + timeIndex + '_canner_query_rightPath', currentTab).val() || '';
        }
        $.ajax({
            method: 'POST',
            url: urlList.query,
            data: param,
            dataType: "json",
            success: function (result) {
                if (!result || result.errorCode) {
                    $.dialog.alert("查询失败");
                    return;
                }

                var afterSort = safeOrder.sortTable(result, systemId, tableId, currentTab);
                columnsNow = afterSort.columnsThis || [];
                var kkData = afterSort.afterData || [];
                table.dataTable($.extend({
                    "data": kkData,
                    "order": [], //取消默认排序查询,否则复选框一列会出现小箭头
                    "columns": columnsNow,
                    "destroy": true,
                    "fnDrawCallback": function () {
                        var tableWrap = $(tableId + '_wrapper', currentTab);
                        var tableContent = tableWrap.find('.dataTables_scrollBody table');
                        var tbodyTable = tableContent.find('tbody');
                        var thFrist = tableWrap.find('.dataTables_scrollHeadInner thead').find('tr').eq(0).find('th').eq(0);
                        if (tbodyTable.find('tr').eq(0).find('td').length > 1) {
                            var trTdFrist = tbodyTable.find('tr').eq(0).find('td').eq(0);
                            var trTdFristWidth = thFrist.width() + 19;
                            var trTdFristHeight = trTdFrist.height() + 1 + 16;
                            var oneHeight = thFrist.height() + 17;
                            tableWrap.css('position', 'relative');
                            var topLL = tableWrap.find('.dataTables_scrollHeadInner').height() + 5;
                            if (tableWrap.find('.Cesoir_can').length > 0) {
                                tableWrap.find('.Cesoir_can').remove();
                            } else {
                                tableWrap.append('<ul class="Cesoir_can"></ul>');
                            }
                            var liHtml = '<li class="bigLi" style="height:' + oneHeight + 'px;line-height:' + oneHeight + 'px;margin-bottom: 3px">' + thFrist.text() + '</li>';
                            tbodyTable.find('tr').each(function () {
                                var thisTd = $(this).find('td').eq(0);
                                var hasMomo = thisTd.find('.when_content_sooLong-inner-momo');
                                var textILI = hasMomo.length > 0 ? showContentCermitic(hasMomo.text(), '', '', {}) : thisTd.text();
                                liHtml += '<li style="height:' + trTdFristHeight + 'px">' + textILI + '</li>';
                            });
                            tableWrap.find('.Cesoir_can').css('width', trTdFristWidth + 'px').html(liHtml);
                        }

                        tableWrap.find('.page_jump').each(function () {
                            $(this).remove();
                        })
                    }
                }, {
                    "language": {
                        "info": "显示第 _START_ 到 _END_ 条数据，总共 _TOTAL_ 条数据",
                        "infoEmpty": "总共 0 条数据",
                        "emptyTable": "没有数据可以显示",
                    },
                    "lengthChange": false,
                    "bStateSave": true, //状态保存
                    "searching": false,
                    "ordering": true,
                    "info": true,
                    "destroy": true,
                    "autoWidth": false,
                    "scrollX": true,
                    // "scrollY": '500px',
                    //"pageLength": 20,
                    //"bLengthChange": true, //改变每页显示数据数量
                    "bPaginate": true, // 分页按钮
                    //  "bFilter" : false,// 搜索栏
                    "renderer": "bootstrap",
                })).api();

            },
            error: function (err) {
                endProcess();
                $.dialog.alert("查询失败");
            }

        })
    },
    sortTable: function (backList, systemID, tableId, currentTab) {
        if (!backList.config) return false;
        var role = backList.config.role;
        var dep = backList.config.dep;
        var coloumn = backList.config.coloumn.sort(function (awe, bwe) {
            return awe.SORD - bwe.SORD
        });
        var coloumnLen = coloumn.length;
        var data = backList.data;
        var afterData = []; //之后
        var roleAndDep = {};

        if (dep.length < 1) {
            $(tableId, currentTab).html('<thead><th></th></thead>');
            return {
                columnsThis: [{
                    "data": '-',
                    "bSortable": false,
                }],
                afterData: [],
            };
        }

        for (var i = 0; i < role.length; i++) {
            var roledep = role[i].DEP_ID;
            if (!roleAndDep[roledep]) {
                roleAndDep[roledep] = [];
            }
            roleAndDep[roledep].push(role[i]);
        }
        var thDeHtml = '';
        var thRoHtml = '';
        var columnsThis = [];
        for (var coe = 0; coe < coloumnLen; coe++) {
            thDeHtml += '<th rowspan="2">' + coloumn[coe].COLOUMN_NAME + '</th>';
            columnsThis.push({
                "data": coloumn[coe].COLOUMN_TEXT,
                "sClass": "text-center",
                "bSortable": false,
                "render": showContentCermitic,
            })

        }

        var roleIdAndName = [];
        var onlyNameOfRole = {};
        for (var j = 0; j < dep.length; j++) {
            var deID = dep[j].DEP_ID;
            var nowRoleDep = roleAndDep[deID];
            var nowRoleDepLen = nowRoleDep.length;
            thDeHtml += '<th colspan="' + nowRoleDepLen + '" class="text-center">' + dep[j].DEP_NAME + '</th>';
            for (var n = 0; n < nowRoleDepLen; n++) {
                var roleName = nowRoleDep[n].ROLE_NAME;
                var roleIdF = nowRoleDep[n].ROLE_ID;
                onlyNameOfRole[roleIdF] = '';
                thRoHtml += '<th>' + roleName + '</th>';
                columnsThis.push({
                    "data": roleIdF,
                    "bSortable": false,
                    "sClass": "text-center",
                    "render": function (data, type, full, meta) {
                        if (!data || data == -1) {
                            return '';
                        } else {
                            return '&radic;';
                        }

                    }
                })
            }
        }
        thDeHtml = '<tr>' + thDeHtml + '</tr>';
        thRoHtml = '<tr>' + thRoHtml + '</tr>';
        $(tableId, currentTab).html('<thead>' + thDeHtml + thRoHtml + '</thead>');
        // 处理 columns
        if (data.length > 0) {
            for (var h = 0; h < data.length; h++) {
                var dataOneTemp = {};
                for (var coel = 0; coel < coloumnLen; coel++) {
                    var coloumnCoel = coloumn[coel];
                    dataOneTemp[coloumnCoel.COLOUMN_TEXT] = data[h][coloumnCoel.COLOUMN_TEXT];
                }
                afterData.push($.extend({
                    name: data[h].FUNCTION_AREA,
                    FUNCTION_AREA: data[h].FUNCTION_AREA,
                    roleData: data[h].ROLE_DATA,
                    ID: data[h].ID,
                    systemId: data[h].SYSTEM_ID,
                }, dataOneTemp, data[h].roleData));
            }
        }
        return {
            afterData: afterData,
            columnsThis: columnsThis,
        };

    },
    //初始化按钮事件
    initButton: function () {},
    //初始化失焦事件（用于计算）
    initFocusout: function () {},
    handleValidation: function () {
        var form2 = $("div.include-jsp:visible").find("div.portlet-title").parent().find("form").eq(0);
        var error2 = $('.alert-danger', form2);
        var success2 = $('.alert-success', form2);

        var formSet = form2.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            //ignore: ".ignore",  // validate all fields including form hidden input
            ignore: ':hidden', //不校验隐藏的input
            rules: {},
            messages: {},
            highlight: function (element) { // hightlight error inputs
                //				$(element).closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group
                //				var icon = $(element).parent('.input-icon').children('i');
                //				icon.removeClass('fa-check').addClass("fa-warning");
            },
            success: function (label, element) {
                //				var icon = $(element).parent('.input-icon').children('i');
                //				$(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                //				icon.removeClass("fa-warning").addClass("fa-check");
            },
            submitHandler: function (form) { //通过校验后执行
                //				success2.show();
                //				error2.hide();
                //------提交时 账号申请表格不能为空
                var currentTab = nowJSP();
                var dateKey = currentTab.find('.portlet').attr('data-time')
                var nowKey = hrefCome[handleList[dateKey].key];
                var id = nowKey.id;
                var idThisNeed = id == OPERATION_ACCOUNT_OPENNING || id == DATA_PLATFORM_OP || id == LEGO_GIVE_ACCOUNT || id == FOURTH_A_ACCOUNT;
                if (idThisNeed) {
                    var tableInevitable = $('#' + dateKey + '_table', currentTab).dataTable();
                    var dataTableFrom = tableInevitable.fnGetNodes();
                    if (dataTableFrom.length < 1) {
                        msgAlert('请在账号信息表中至少填写一条账号信息!');
                        return false;
                    }

                }
                safe_submitOp.submit(); //提交操作
            }
        });
    },
};

/**
 * 提交操作
 */
var safe_submitOp = {
    handleTabData: function (currenttab) {
        //处理指定表格的数据
        var result = "";
        var jqtable = currenttab.find("form").eq(0).find("table:visible");
        var thLength = jqtable.find("tr:eq(0)").children("th").length; //表格的列数
        var inputLength = jqtable.find("input").length - 2; //除去合计行的两个input
        var index = 0;
        jqtable.find("input:lt(" + inputLength + "),select").each(function () {
            index++;
            if ($(this).is('select')) {
                value = $.trim($(this).find('option:selected').text());
            } else {
                var value = $(this).val();
            }

            result = result + value + ",";
            if (index % thLength == 0) { //一行结束，已;分隔
                result = result + ";";
            }
        });
        result = result + "@";
        inputLength = parseFloat(inputLength) - 1;
        jqtable.find("input:gt(" + inputLength + ")").each(function () {
            result = result + $(this).val() + ",";
        });
    },
    submit: function () {
        var dateKey = nowJSP().find('.portlet').attr('data-time');
        var nowFrom = hrefCome[handleList[dateKey].key];
        var currentprocessInstanceId = nowFrom.processInstanceId;
        var currenttab = $("div.include-jsp:visible").find("div.portlet-title").parent();
        var currentorderId_prefix = $("input[name='orderId_prefix']", currenttab).val();
        var ifNext = orderComm.verificationRequire('safe1_title', 'safe1_describe', 'safe1_completeTime');
        if (!ifNext) {
            return false;
        }
        safe_submitOp.handleTabData(currenttab);
        var _param = currenttab.find("form").eq(0).serialize();
        var isRightChangeOrder = safeOrder.getTypeIfChangeRight();
        if (isRightChangeOrder) {
            safeOrder.roleChangeUpData(function () {
                orderComm.submit(_param, orderComm[currentorderId_prefix + currentprocessInstanceId + "_filelist"], currenttab.find("form").eq(0), orderComm[currentorderId_prefix + "Order" + currentprocessInstanceId + "_hadfilelist"])
            });
        } else {
            orderComm.submit(_param, orderComm[currentorderId_prefix + currentprocessInstanceId + "_filelist"], currenttab.find("form").eq(0), orderComm[currentorderId_prefix + "Order" + currentprocessInstanceId + "_hadfilelist"]);
        }

    }
};
/**
 * 处理审批
 */
var safeHandle = {
    showUsertask: function () {
        //表单赋值
        var dataKey = nowJSP().find('.portlet').attr('data-key');
        var nowFrom = hrefCome[dataKey];
        var processInstanceId = nowFrom.processInstanceId;
        var orderId_prefix = nowFrom.orderId_prefix;
        var url = ACT_URL + "/act/orderManage/getFormInfo";
        var currenttab = $("div.include-jsp:visible").find("div.portlet-title").parent();
        $.post(url, {
            'processInstanceId': processInstanceId,
            orderId_prefix: orderId_prefix
        }, function (data) {
            var fysp1_type;
            var fysp1_bxTab;
            for (var i = 0; i < data.length; i++) {
                var av = data[i];
                if (av.tagType == 'text' && av.attrAsName != '描述') {
                    if ($("input[name='" + av.attrCode + "']", currenttab).length > 0) {
                        var nodeUI = $("input[name='" + av.attrCode + "']", currenttab);
                        nodeUI.val(av.attrValue);
                    } else {
                        $("span[class='" + av.attrCode + "']").append(av.attrValue);
                    }
                } else if (av.tagType == 'radio') {
                    $("input[name='" + av.attrCode + "'][value='" + av.attrValue + "']", currenttab).prop('checked', 'checked');
                    $("input[name='" + av.attrCode + "'][value='" + av.attrValue + "']", currenttab).parents('.col-md-12').attr('data-get', 'really');
                    if ($("input[name='" + av.attrCode + "'][value='" + av.attrValue + "']") !=
                        $("input[name='" + av.attrCode + "']:first")) {
                        $("input[name='" + av.attrCode + "'][value='" + av.attrValue + "']").change();
                    }
                } else if (av.tagType == 'textarea' || av.attrAsName == '描述') {
                    if (av.length) {
                        $("textarea[name='" + av.attrCode + "']", currenttab).attr('maxlength', av.length);
                    }
                    $("textarea[name='" + av.attrCode + "']", currenttab).val(av.attrValue);
                }
                if (av.attrCode === 'safe1_Informer') {
                    orderComm.informerDealCon({
                        currentTab: currentTab,
                        value: av.attrValue || '',
                        type: 'setValue',
                        name: 'safe1_Informer'
                    })
                }
            }
            handleTask.raidoInit($("form:gt(0)", safeOrder.parentDiv));

            //				 if(taskDefinitionKey!='usertask1' || handleType==2){//审批环节或者展示
            //					 ptHandle.showFyTab(fysp1_type, fysp1_bxTab);
            //				 }else{//重新提交申请
            //					 ptHandle.showFyTabInput(fysp1_type, fysp1_bxTab,orderId_prefix,processInstanceId);
            //				 }
        }, 'json');
    },
};
/*----------------------------------------------------------------*/
var dateKey = nowJSP().find('.portlet').attr('data-time');
var currentTab = handleList[dateKey].nodeKeep;
var nowFrom = hrefCome[handleList[dateKey].key];
var processInstanceId = nowFrom.processInstanceId;
var taskDefinitionKey = nowFrom.taskDefinitionKey;
if (processInstanceId == '') { //初次申请
    safeOrder.init();
} else if (taskDefinitionKey == 'usertask1') { //驳回后再次申请
    safeOrder.init();
    safeHandle.showUsertask();
} else { //审批
    //	 ptOrder.initSelect();
    //	 ptOrder.initChange();
    safeHandle.showUsertask();
}
safeOrder.ifNeedDoThat();
