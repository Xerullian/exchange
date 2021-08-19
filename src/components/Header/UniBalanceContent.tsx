import { TokenAmount } from '@pancakeswap-libs/sdk-v2'
import BigNumber from 'bignumber.js';
import React from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/burn1-logo.png'
import { BURN1COIN } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, UniTokenAnimated } from '../../theme'
import usePriceData from '../../utils/usePriceData'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  background: #1e262f;
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function UniBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const burn1 = chainId ? BURN1COIN[chainId] : undefined

  const totalSupply: TokenAmount | undefined = useTotalSupply(burn1)
  const priceData = usePriceData()
  const burn1Price = priceData && burn1 ?new BigNumber(priceData.data[burn1.address].price) : undefined

  const burn1Total = useTokenBalance(account ?? undefined, burn1)
  const burn1DecimalTotal = burn1Total ? new BigNumber(burn1Total.toExact()) : undefined

  const burn1Balance = burn1Price && burn1DecimalTotal
  ? burn1Price.multipliedBy(burn1DecimalTotal)
  : undefined;

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">Your BURN1COIN Breakdown</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={32} fontWeight={600} color="white">
                  {burn1Total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Balance:</TYPE.white>
                  <TYPE.white color="white">${burn1Balance?.toFormat(2)}</TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">BURN1COIN price:</TYPE.white>
              <TYPE.white color="white">${burn1Price?.toFixed(11) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">Total Supply</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
