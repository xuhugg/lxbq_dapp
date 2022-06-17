import store from "../../store";


/**
 * .env 是否开启web3功能（以太链、币安链、heco链） 开启时生效
 * @param {*} symbol 代币名称 也就是合约.js的文件名
 * @param {*} precision 精度默认 ether
 * @param {*} isMain 是否是主链货币 例如果是ETH-BNB 则是主链货币 USDT 是代币
 */
export function getEthBalance(symbol, precision = 'ether', isMain = false) {
    return new Promise((resolve, reject) => {

        if (process.env.VUE_APP_OPEN_WEB3 === 'true') {
            if (!isMain) {
                let contract = store.state.wallet.contract[symbol]
                contract.methods.balanceOf(store.state.wallet.account).call().then(res => {
                    resolve(Number(store.state.wallet.web3.utils.fromWei(res, precision)).toFixed(6))
                }).catch(err => {
                    reject('出现错误', err)
                })

            } else {
                let web3 = store.state.wallet.web3
                web3.eth.getBalance(store.state.wallet.account).then(res => {
                    resolve(Number(store.state.wallet.web3.utils.fromWei(res, precision)))
                }).catch(err => {
                    reject('出现错误', err)
                })
            }
        }

        if (process.env.VUE_APP_OPEN_WEB3_TRON === 'true') {
            if (!isMain) {
                let contract = store.state.tronWallet.contract[symbol]
                contract.balanceOf(store.state.tronWallet.account).call().then(res => {
                    //精度问题待修复
                    resolve(res)
                }).catch(err => {
                    reject('出现错误', err)
                })
            } else {
                let tronWeb = store.state.tronWallet.web3
                tronWeb.trx.getBalance(store.state.tronWallet.account).then(res => {
                    resolve(Number(tronWeb.fromSun(res)).toFixed(6))
                }).catch(err => {
                    reject('出现错误', err)
                })
            }

        }


    })

}
/**
 * 
 * @param {*} symbol 代币名称 也就是合约.js的文件名
 * @param {*} amount 转账数量
 * @param {*} address 接受地址
 * @param {*} precision 精度默认 ether
 * @param {*} isMain 
 * @returns 是否是主链货币 例如果是ETH-BNB 则是主链货币 USDT 是代币
 * 
 * 波场中 如果trx转账金额大于余额 会报错 报错无法监听到，请注意判断 
 * 


 */
export function transfer(symbol, amount, address, precision = 'ether', isMain = false) {
    return new Promise((resolve, reject) => {
        if (process.env.VUE_APP_OPEN_WEB3 === 'true') {
            if (!isMain) {
                let contract = store.state.wallet.contract[symbol]
                contract.methods.transfer(address, store.state.wallet.web3.utils.toWei(amount, precision)).send((err, hash) => {
                    if (err) {
                        reject(false)
                    } else {
                        resolve(hash)
                    }

                }).then(() => {
                    resolve('交易成功')
                }).catch(err => {
                    reject('出现错误', err)
                })

            } else {
                let web3 = store.state.wallet.web3
                console.log(web3);
                web3.eth.sendTransaction({
                    from: store.state.wallet.account,
                    value: store.state.wallet.web3.utils.toWei(amount, precision),
                    to: address
                },
                    function (err, hash) {
                        console.log(err);
                        resolve(hash)
                    }
                ).then(() => {
                    resolve('交易成功')
                }).catch(err => {
                    reject('出现错误', err)
                })
            }
        }
        if (process.env.VUE_APP_OPEN_WEB3_TRON === 'true') {
            if (!isMain) {
                let contract = store.state.tronWallet.contract[symbol]
                console.log(contract);
                contract.methods.transfer(address, store.state.tronWallet.web3.toHex(amount * Math.pow(10, 18))).send((err, hash) => {
                    if (err) {
                        reject(false)
                    } else {
                        resolve(hash)
                    }
                }).then(() => {
                    resolve('交易成功')
                }).catch(err => {
                    reject('出现错误,请排查合约是是否正确或当前链是否为合约所在链', err)
                })
            } else {
                let tronWeb = store.state.tronWallet.web3
                tronWeb.trx.sendTransaction(address, tronWeb.toSun(amount)
                ).send((err, hash) => {
                    console.log(err, hash);
                }).then(() => {
                    resolve('交易成功')
                }).catch(err => {
                    reject('出现错误', err)
                })
            }
        }
    }
    )
}


/**
 * 
 * @param {*} symbol NFT 合约名称 也就是合约.js的文件名
 * @param {*} address  用户地址    -----从
 * @param {*} to    转入地址    --------到
 * @param {*} tokenId   NFT卡片的id
 */
export function transferFrom(symbol, address, to, tokenId) {
    return new Promise((resolve, reject) => {
        if (process.env.VUE_APP_OPEN_WEB3 === 'true') {
            let contract = store.state.wallet.contract[symbol]
            contract.methods.transferFrom(address, to, tokenId).send((err, hash) => {
                if (err) {
                    reject(false)
                } else {
                    resolve(hash)
                }
            }).then(res => {
                resolve('交易成功', res)
            }).catch(err => {
                reject('出现错误', err)
            })
        }
        if (process.env.VUE_APP_OPEN_WEB3_TRON === 'true') {
            // let tronWeb = store.state.tronWallet.web3
            // tronWeb.trx.sendTransaction(address,tronWeb.toSun(amount)
            // ).send((err,hash)=>{
            //     console.log(err,hash);
            // }).then(()=>{
            //     resolve('交易成功')
            // }).catch(err=>{
            //     reject('出现错误',err)
            // })
            reject('暂未实现')
            console.warn('暂未实现')
        }
    })

}

/**
 *
 * @param {*} symbol  需要给合约授权的代币名称 也就是合约.js的文件名
 * @param {*} address  合约地址  说明：“被授权合约”可以从授权过的账户地址提取代币
 * @param {*} amount  授权数量
 */

export function approve(symbol, address, amount = "10000000000000000000000000000000000000") {
    if (process.env.VUE_APP_OPEN_WEB3 === 'true') {
        return new Promise((resolve, reject) => {
            // 获取合约
            let contract = store.state.wallet.contract[symbol]
            // 检测是否授权
            contract.methods.allowance(store.state.wallet.account, address).call().then(res => {
                if (res <= 1) {
                    console.warn("当前合约没有进行授权", res)
                    // 将代币授权给合约进行调用
                    contract.methods.approve(address, amount).send((err, hash) => {
                        if (err) {
                            reject(false)
                        } else {
                            resolve(hash)
                        }
                    }).then(() => {
                        resolve('授权成功')
                    }).catch(err => {
                        reject('授权错误', err)
                    })
                } else {
                    console.log("已经授权过了,当前合约剩余可支配数：", res);
                    resolve(true)
                }

            }).catch((err) => {

                reject('智能合约出错，请检查智能合约是否存在', err)
            })
        })
    }
    if (process.env.VUE_APP_OPEN_WEB3_TRON === 'true') {
        console.warn('暂未测试--测试链')

        return new Promise((resolve, reject) => {
            // 获取合约
            let contract = store.state.tronWallet.contract[symbol]
            let web3 = store.state.tronWallet.web3
            // 检测是否授权
            console.log(store.state.tronWallet.account);
            contract.methods.allowance(store.state.tronWallet.account, address).call().then(res => {
                if (web3.toDecimal(res._hex) <= 0) {
                    console.warn("当前合约没有进行授权", res)
                    // 将代币授权给合约进行调用
                    contract.methods.approve(address, amount).send((err, hash) => {
                        console.log(err);
                        resolve(hash)
                    }).then(() => {
                        resolve('授权成功')
                    }).catch(err => {
                        reject('授权错误', err)
                    })
                }
            }).catch((err) => {
                reject('智能合约出错，请检查智能合约是否存在', err)
            })

        })
    }


}


/**
 * 
 * @param {*} symbol 代币名称
 * @param {*} address  代币地址
 * @param {*} decimals  代币精度
 * @param {*} img  代币图标
 */

export function addTokenToWallet(symbol, address, decimals, img) {
    if (process.env.VUE_APP_OPEN_WEB3 === 'true') {
        return new Promise((resolve, reject) => {
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: address,
                        symbol: symbol,
                        decimals: decimals,
                        image: img,
                    },
                },
            }).then((success) => {
                if (success) {
                    resolve('添加成功')
                } else {
                    reject('添加失败')
                }
            })
        })
    }


}