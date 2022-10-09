// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface tokenRecipient {
    function receiveApproval(
        address _from,
        uint256 _value,
        address _token,
        bytes calldata _extraData
    ) external;
}

contract ManGanCoin {
    // Public variables
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // Create an array with all the balances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Generate a public event on the blockchain which will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 value
    );

    // Notifies the clients of the amount burnt
    event Burn(address from, uint256 value);

    /**
     * Constructor Function
     *
     * Initializes the contract with an initial supply of tokens to the creator
     */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        string memory tokenSymbol
    ) {
        totalSupply = initialSupply * 10**uint256(decimals); // Update the total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply; // Give the creator of the contract the total supply
        name = tokenName; // Set the name of the token
        symbol = tokenSymbol; // Set the symbol of the token
    }

    /**
     * Internal transfer, that can only be called by this contract
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // Prevent transfer to an 0x0 address, use burn() instead
        require(_to != address(0x0));
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        // Save this assertion for later
        uint256 previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract amount from the sender
        balanceOf[_from] -= _value;
        // Add the same quantity to the recipient
        emit Transfer(_from, _to, _value);
        // Asserts are used for static analysis for bug finding
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer Tokens
     *
     * Send `_value` tokens to `_to` on behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value The amount to send
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]); // Checks the allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other addresses
     *
     * Allows `_spender` to spend no more that the `_value` tokens on your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value The max amount they can spend
     */
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * Set allowance for other addresses and notify
     *
     * Allows `_spender` to spend no more that the `_value` tokens on your behalf, then ping the contract about it
     *
     * @param _spender The address authorized to spend
     * @param _value The max amount they can spend
     * @param _extraData Some extra information to send to the approved contract
     */
    function approveAndCall(
        address _spender,
        uint256 _value,
        bytes memory _extraData
    ) public returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(
                msg.sender,
                _value,
                address(this),
                _extraData
            );
            return true;
        }
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value The amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value); // Check the sender has enough
        balanceOf[msg.sender] -= _value; // Subtract from the sender
        totalSupply -= _value; // Updates the total supply
        emit Burn(msg.sender, _value);
        return true;
    }

    /**
     * Destroys tokens from other accounts
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _value The amount of money to burn
     */
    function burnFrom(address _from, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[_from] >= _value); // Check if the targeted balance is enough
        require(_value <= allowance[_from][msg.sender]); // Check allowance
        balanceOf[_from] - _value; // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value; // Subtract from the sender's allowance
        totalSupply -= _value; // Update totalSupply
        emit Burn(_from, _value);
        return true;
    }
}