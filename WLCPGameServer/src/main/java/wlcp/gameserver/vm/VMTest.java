package wlcp.gameserver.vm;

public class VMTest {

	public static void main(String[] args) {
		
		VirtualMachine vm = new VirtualMachine();
		vm.Start("programs/estimateit.js");

	}

}
