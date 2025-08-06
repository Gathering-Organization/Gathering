const Footer: React.FC = () => {
  return (
    <div
      className="text-center flex flex-col sm:flex-row items-center justify-center sm:justify-between 
                    bg-[#000000]/80 text-xs sm:text-sm md:text-base text-[#D9D9D9]/70 font-bold 
                    p-4 sm:p-6 md:p-8 lg:p-[70px] px-4 sm:px-6 md:px-10 lg:px-[200px]"
    >
      <div className="mb-4 sm:mb-0 text-center sm:text-left">
        <div>How to contact?</div>
        <div>Email : gatheringcrew1820@gmail.com</div>
      </div>
      <hr className="hidden sm:block w-[1px] h-16 sm:h-20 md:h-24 bg-[#D9D9D9]/70 border-none mx-4 sm:mx-6 md:mx-10" />
      <div className="text-center sm:text-right">
        <div>Copyright ⓒ 2025 Gathering Team</div>
        <div>윤종근, 최보근</div>
      </div>
    </div>
  );
};

export default Footer;
