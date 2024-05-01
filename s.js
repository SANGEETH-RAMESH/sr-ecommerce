// function* Prime(first, last) {
//     let count = 0;

//     for (let i = first; i < last; i++) {
//         let flag = 0;
        
//         for (let j = 2; j < i; j++) {
//             if (i % j === 0) {
//                 flag = 1;
//                 break; // Break out of the loop once a divisor is found
//             }
//         }
        
//         if (flag === 0 && i !== 1) {
//             count++;
//             yield i;
//             if (count >= 5) {
//                 break; // Exit the generator once 5 prime numbers are generated
//             }
//         }
//     }
// }

// const primeNumbers = [];
// for (const prime of Prime(1, 100)) {
//     primeNumbers.push(prime);
// }
// console.log(primeNumbers);

// var i=1
// do{
//     console.log("hello")
//     i++
// }while(i<=5)

// let candies=[2,3,5,1,3]
// let extraCandies = 3
// const a=[...candies]
// console.log(a)
// const result=a.sort((a,b)=>b-a)[0];
// console.log(result)
// var emptyarray=[];
// for(i=0;i<candies.length;i++){
//     if((candies[i]+extraCandies)>=result){
//         console.log("yes")
//         emptyarray.push(true);
//     }
//     else{
//         console.log("no")
//         emptyarray.push(false)
//     }
   
// }

// console.log(emptyarray)

// const nums = [1,2]
// const result = new Set(nums);
// const resultArray = Array.from(result);
// const lastElement = resultArray[resultArray.length - 1];
// console.log(lastElement);

// const str="Malayalam"
// const a=str.toLowerCase();
// console.log(a)
// const b=a.split('').reverse('').join('')
// console.log(b)
// if(a==b){
//     console.log("Palindrome")
// }
// else{
//     console.log("Not Palindrome")
// }

// const str="Malayalam"
// function Palindrome(str){
//     let a=str.toLowerCase();
//     let left=0;
//     let right=str.length-1;
//     while(left<right){
//         if(a[left]!==a[right]){
//             return false
//         }
//         left++;
//         right--;
//     }
//     return true
// }
// const c=Palindrome(str)
// console.log(c)

// nums = [3,2,1]
// let emptyarray=[];
// for(let i=0;i<3;i++){
//     // console.log(emptyarray)
//     for(let j=i+1;j<2*i;j++){
//         if(nums[i]!==nums[j]&&i!=j){
//             console.log(i)
//             emptyarray.push(nums[i])
//             // console.log(emptyarray)
//         }
//     }
        
    
// }
// console.log(emptyarray)

// let nums=9996
// const num = nums.toString().split('');
// console.log(num)

// for(let i=0;i<num.length;i++){
//     // console.log('hello')
//     if(num[i]<9){
//         // console.log('df')
//         num[i]=9
//         // console.log("nusm",nums[i])
//         break
//     }
    
// }
// const result=num.join('')
// console.log(result)

// let n=['apple','bananana','wordsa']
// for(let i=0;i<n.length-1;i++){
//     if(n[i].length>n[i+1].length){
//         temp=n[i];
//         n[i]=n[i+1]
//         n[i+1]=temp;
//     }
// }

// console.log(n[0].length)
// console.log(n)

let l1 = [2,4,3]
let l2 = [5,6,4]
// let emptyarray=[]
// // let result=l1.toString().join('')
// let result=[...l1,...l2]
// let n=l1.length
// console.log(n)
// console.log(result)

// for(let i=0;i<n;i++){
//     a=result[i]+result[i+n]
//     emptyarray.push(a)
// }

// console.log(emptyarray)
// const b=result.join('')
// console.log(b)

// let L1=l1.join('')
// console.log(L1)

// let  nums = [1,2,3,4];

// let result=0;
//     for(let i=0;i<nums.length;i++){
//         if((nums.length)%(i+1)==0){

//             result=result+(nums[i]*nums[i])
//         }
//         console.log(result)
//     }
//  console.log(result) 

// console.log(0==false)
// console.log(0===false)

// let s="codeleet"
// let indices=[4,5,6,7,0,2,1,3]
// let a=[]
// for(let i=0;i<indices.length;i++){
//     for(let j=0;j<indices.length;j++){
//         if(i==indices[j]){
//             a.push(s[j])
//             continue;
//         }
//     }
// }
// console.log(a.join(''))

// let n = 10
// let m = 3
// var num1=0,num2=0;
//     for(let i=1;i<=n;i++){
//         if(i%m==0){
//             num2=num2+i;
//         }else{
//             num1=num1+i;
//         }
//     }
//     console.log(num2,num1)

//     console.log(num1-num2)

// let result=[]
// let a=0,b=0;
// let nums = [1,15,6,3]
// for (let num of nums) {
//     let numStr = num.toString(); // Convert number to string
//     let digits = numStr.split('').map(Number); // Split string into individual characters and convert each character back to a number
//     result.push(...digits); // Push each digit into the result array individually
// }
//     for(i=0;i<nums.length;i++){
//         b=b+nums[i]
//     }

// for(i=0;i<result.length;i++){
//     a=a+result[i]
// }
// const answer=b-a;
// return answer

// let sentences = ["alice and bob love leetcode", "i think so too", "this is great thanks very much"]

// let Max=0;
// for(let i=0;i<sentences.length;i++){
//     let count=sentences[i].split(' ').length;
//     Max=Max>count?Max:count;
// }
// console.log(Max)

// let nums=[1,1,2]
// for(let i=0;i<nums.length;i++){
//     for(let j=i+1;j<nums.length;j++){
//         if(nums[i]==nums[j])
//         nums[i]='_'
//     }
// }
// console.log(nums)

// let nums = [8,19,4,2,15,3]
// let original = 2

// let s=nums.sort((a,b)=>a-b)
// console.log(s)

// for(let i=0;i<s.length;i++){
//     if(original==nums[i]){
//         original=original*2;
    
//     }
//     if(i==nums.length){}
// }
// console.log('dfj',original)

// let nums1 = [1,2,3,0,0,0] 
// let m = 3
// let nums2 = [2,5,6], n = 3

// for(i=0;i<nums1.length;i++){
//     if(nums1[i]==0){
//         for(j=0;j<n;j++){
//             if(nums2.length>0)
//              nums1[i]=nums2[j]
//              nums2.splice(nums2.indexOf(nums1[i]),1)
//              console.log(nums2)
//             break;
//         }
//         console.log(nums1)
       
       
//     }
// }
// console.log(nums1) ;


// const a=[10,11,12,13,14];
// const b=a.join(',');
// console.log(b)



// const nums = [3,2,2,3]
// const val = 3
// // for(let i=0;i<nums.length;i++){
// //     if(nums[i]==val){
// //         nums[i]=='_'
// //     }
// // }

// var a=[]
//     for(let i=0;i<nums.length;i++){
//         if(nums[i]==val){
//             nums[i]='_'
//         }
//         else{
            
//             a.push(nums[i])
//         }
//     }
//     // return a;
// console.log(a)

// let nums = [12,345,2,6,7896];
// let a=nums.join;
// console.log(a)
// var count=0;
//     for(let i=0;i<nums.length;i++){
//         console.log(nums[i])
//         if(nums[i].toString().length%2==0){
//             // console.log('1')
//             count=count+1;

//             // console.log(count)
//         }
//     }
//     // console.log(count)
//     console.log(count)



// let nums = [-2,-1,-1,1,2,3]
// var pcount=0;
// var ncount=0;
// for(let i=0;i<nums.length;i++){
//     if(nums[i]>0){
//         console.log(nums[i])
//         pcount=pcount+1
//     }
//     else if(nums[i]<0){
//         console.log(nums[i],'df')
//         ncount=ncount+1
//     }
//     console.log(pcount,ncount)
// }
// if(pcount>ncount){
//     return pcount
// }else{
//     return ncount;
// }

// var n = 3

// var emptyarray=[]
// for(let i=1;i<=n;i++){
//         console.log('1')
//      if(i%3==0){
//             console.log('1')
//             emptyarray.push('Fizz')
//       }
//       else if(i%3==0&&i%5==0){
//             emptyarray.push('FizzBuzz')
//      }
//      else if(i%5==0){
//             emptyarray.push('Buzz')
//      }
//     else{
//             emptyarray.push(String(i))
//     }
    
// }
//     console.log(emptyarray)\



// var nums = [1,2,3,2]
// var sum=0

// let emptyarray=[]
//     for(let i=0;i<nums.length;i++){
//         var count=1;
//         for(let j=0;j<nums.length;j++){
//             if(nums[i]==nums[j]&&i!=j){
//                 count=count+1;
//             }
//         }
//         if(count==1){
//             sum=sum+nums[i]
//         }
//     }
//     console.log(sum)

// let nums = [-4,-1,0,3,10]
// nums.sort((a,b)=>a-b);
// let s=nums.map((value)=>{
//     return value*value;
// })
// s.sort((a,b)=>a-b)
// console.log(s)

// let a = 12
// let  b = 6
// var count=0
//     for(let i=1;i<=b;i++){
//         console.log('1')
//         if(a%i==0&&b%i==0){
//             console.log('hi')
//             count=count+1;
//             console.log(count)
//         }
//     }
//     console.log(count) 


// let candies = [2,3,5,1,3]
// let extraCandies = 3
// let r=[]; 
// let n=candies.slice()
// let k=n.sort((a,b)=>b-a)
// let l=k[0]

// for(let i=0;i<candies.length;i++){
//     if(candies[i]+extraCandies>=l){
//     r.push("true")
//     }else {
//     r.push("false")
//     }
// }
// console.log(r);

// int i,j;
// for


// let a =[1,2,45,3,5]
// let b=a.forEach(result=>result*2)
// console.log(b)

// let a=[12,242,545,646]
// let b=a.filter(result=>result%2==0)
// console.log(b)