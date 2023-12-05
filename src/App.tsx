import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'loadsh'
import axios from '@/utils/http/request';
import { Card, Col, Row, Spin, message } from 'antd'

const { Meta } = Card;

type PokemonState = {
  // 加载数据
  loading: boolean,
  pokemonList: PokemonList | null
}

const PokemonList = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const [list, setList] = useState<PokemonDetail[]>([])
  const [state, setState] = useState<PokemonState>({
    loading: false,
    pokemonList: null
  })

  const dataRef = useRef<PokemonState>(state)

  useEffect(() => {
    dataRef.current = { ...state }
  }, [state])

  /**
   * 获取接口数据
   * @param url 列表数据 
   * @param append 是否追加到列表
   * @returns 
   */
  const fetchPokemonList = async ({url = '/pokemon', append = true }) => {
    try {
      if (dataRef.current.loading) {
        return
      }
      setState(prev => ({ ...prev, loading: true }))
      const response: PokemonList = await axios.get(url);
      const promises: Promise<PokemonDetail>[] = []
      response.results.forEach(res => {
        promises.push(axios.get(res.url))
      })
      Promise.all(promises).then((results: PokemonDetail[]) => {
        setList(prev => {
          if (append) {
            return [...prev, ...results]
          }
          return [...results]
        })
        setState(prev => ({ ...prev, loading: false, pokemonList: response }))
      })
    } catch (error: Error) {
      console.error('Error fetching Pokemon list:', error);
      messageApi.open({
        type: 'error',
        content: error.message || '请求接口失败',
      });
      setState(prev => ({ ...prev, loading: false }))
    }
  };

  useEffect(() => {
    fetchPokemonList({url: '/pokemon', append: false });
  }, []);

  // 滚动事件，节流处理
  const onscroll = throttle((e: React.SyntheticEvent) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement
    // 距离底部100px时加载下一页数据
    if (!dataRef.current.loading && dataRef.current.pokemonList?.next && scrollHeight - clientHeight - scrollTop < 100) {
      fetchPokemonList({url: dataRef.current.pokemonList.next || '/pokemon'})
    }
  }, 500)

  return (
    <div className="pokemon-page" id="scroll" onScroll={onscroll} style={{height: '100vh', overflow: 'scroll'}}>
      {contextHolder}
      <Row justify="space-around" align="top">
        {
          list.map((item, idx) => <Col key={`${item.id}-${idx}`} span={5} style={{marginTop: 20}}>
            <Card
              hoverable
              cover={<img alt={item.name} src={item.sprites.back_default} />}
            >
              <Meta title={item.name} />
            </Card>
          </Col>)
        }
      </Row>
      {
        state.loading && <div className="loading-box" style={{height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spin /></div>
      }
    </div>
  );
};

export default PokemonList;
