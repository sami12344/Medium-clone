import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from 'react-icons/bs'

const Footer = () => {
  return (
    <div className=" w-full overflow-x-hidden rounded-md border-2 bg-black py-5 px-3 text-white">
      <div className="my-2 flex h-6 w-full items-center justify-between">
        <img
          src="https://miro.medium.com/max/8976/1*Ra88BZ-CSTovFS2ZSURBgg.png"
          className="h-10 "
          alt=""
        />
        <div className="flex h-full w-full items-center justify-end space-x-2 ">
          <div>
            <a href="https://www.instagram.com/sami._.islam/" target="_blank">
              <BsInstagram />
            </a>
          </div>
          <div>
            <a href="https://www.facebook.com/samiislam16203" target="_blank">
              <BsFacebook />
            </a>
          </div>
          <div>
            <a href="https://twitter.com/Sami89047551" target="_blank">
              <BsTwitter />
            </a>
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/sami-islam-427020218/"
              target="_blank"
            >
              <BsLinkedin />
            </a>
          </div>
          <div>
            <a href="https://github.com/sami12344" target="_blank">
              <BsGithub />
            </a>
          </div>
        </div>
      </div>

      <div>
        <hr className="my-2 " />
        <p className="text-center">
          Copyright © 2022 by <span className="font-bold"> Sami Islam</span>
        </p>
      </div>
    </div>
  )
}

export default Footer
