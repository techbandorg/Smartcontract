pragma solidity 0.8.12;

interface IRouterCallee {
    function routerCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
