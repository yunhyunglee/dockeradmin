import React,{ useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jaxios from '../../../util/JwtUtil';
import '../../../style/addMembership.scss';


const UpdateMemberShip = () => {

    const navigate = useNavigate();

    const [membership, setMembership] = useState({});

    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');

    const [downloadCount, setDownloadCount] = useState('');
    const [period, setPeriod] = useState('');
    
    const {membershipId} = useParams();
    
    const [active, setActive] = useState('');

    // 숫자로 변환하여 NaN 방지
    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discount) || 0;

    // 할인 금액 및 최종 가격 계산
    const discountPrice = (numericPrice * (numericDiscount / 100)).toFixed(0);
    const discountedPrice = numericPrice - discountPrice;

    useEffect(()=>{
        jaxios.get('/api/membership/getMembershipById', {params:{membershipId:membershipId}})
        .then((result)=>{
            console.log(result);
            setMembership(result.data.membership);
            setCategory(result.data.membership.category);
            setName(result.data.membership.name);
            setContent(result.data.membership.content);
            setPrice(result.data.membership.price);
            setDiscount(result.data.membership.discount);
            setDownloadCount(result.data.membership.downloadCount);
            setPeriod(result.data.membership.period);

        })
        .catch((err)=>{
            console.error(err);
        })
    },[membershipId]);

    function updateMembership(){
        jaxios.post('/api/membership/updateMembership', {category, name, content, price, discount, downloadCount, period})
        .then((result)=>{
            if(result.data.message === 'yes'){
                alert('멤버십이 수정되엇습니다.');
                navigate('/membership');
            }
        })
        .catch((err)=>{
            console.error(err);
        })
    };

    return (
        <div className='AddMembershipPage'>
            <h1>멤버십 수정</h1>
            <div className='memberShipField'>
                <label>카테고리</label>
                {/* 카테고리는 옵셔널 이용해서 선택하는방식 */}
                {/* 카테고리가 streaming / download  기간 12개월 고정/ gift 기간 12개월 고정 */}
                <select value={category} onChange={(e)=>{
                    setCategory(e.currentTarget.value);
                }}>
                    <option value="">카테고리를 선택하세요</option>
                    <option value="streaming">Streaming</option>
                    <option value="download">Download</option>
                    <option value="gift">Gift</option>
                </select>
            </div>
            <div className='memberShipField'>
                <label>멤버십 이름</label>
                <input type='text' value={name} onChange={(e)=>{
                    setName(e.currentTarget.value);
                }} />
            </div>
            <div className='memberShipField'>
                <label>설명</label>
                <input type='text' value={content} onChange={(e)=>{
                    setContent(e.currentTarget.value);
                }} />
            </div>

            <div className='memberShipField'>
                <div className='memberShipPriceForm'>
                    <div className='memberShipPriceField'>
                        <label>가격(원)</label>
                        <input type='text' value={price} onChange={(e)=>{
                            setPrice(e.currentTarget.value);
                        }} />
                    </div>
                    <div className='memberShipPriceField'>
                        <label>할인율(%)</label>
                        <input type='text' value={discount} onChange={(e)=>{
                            setDiscount(e.currentTarget.value);
                        }} />
                    </div>
                    <div className='memberShipPriceField'>
                        <label>할인 후 금액(원)</label>
                        <input type='text' value ={discountedPrice} readOnly />
                    </div>
                </div>
            </div>
            
            <div className='memberShipField'>
                <label>다운로드(회)</label>
                {
                    (category === 'streaming')?(
                        < input type='text' value={''} readOnly/>
                    ):(<input type='text' value={downloadCount} onChange={(e)=>{
                        setDownloadCount(e.currentTarget.value);
                    }} />)
                }
            </div>
            <div className='memberShipField'>
                <label>기간(개월)</label>
                {
                    (category==='download' || category === 'gift')?(
                        < input type='text' value={12} readOnly/>
                    ):(<input type='number' value={period} onChange={(e)=>{
                        setPeriod(e.currentTarget.value);
                    }} />)
                }
            </div>
            <div className='btns'>
                <button onClick={()=>{
                    updateMembership();
                }}>수정</button>
                <button onClick={()=>{
                    navigate(-1);
                }}>취소</button>
            </div>
            

        </div>
    )
}

export default UpdateMemberShip
